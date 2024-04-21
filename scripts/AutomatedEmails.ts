import { schedule } from "node-cron";
import { sendEmail } from "@/app/utils/emailService";
import prisma from "@/app/db";

/**
 * This function is for the pre-marking stage of assessments.  Part 8 is the
 * final stage of the assessment process before it gets handed out;
 * Part 1: Assessment availability
 * Part 2: Internal moderator comments
 * Part 3: Response to internal moderation
 * Part 4: Moderation panel comments
 * Part 5: Response to moderation panel
 * Part 6: External examiner feedback
 * Part 7: Response to external examiner feedback
 * Part 8: External examiner feedback monitoring
 */
async function checkPremarkingPartsFinished() {
  // Fetch assessments along with the setter and their opt-in status
  const assessments = await prisma.assessment.findMany({
    include: {
      setter: true,
      partSubmissions: true,
    },
  });

  // Iterate over assessments and check conditions
  for (const assessment of assessments) {
    if (assessment.partSubmissions.length < 8) {
      // Check if the setter has opted in for emails and that an email address exists
      if (
        assessment.setter &&
        assessment.setter.email &&
        assessment.setter.isOptedInForEmails
      ) {
        try {
          await sendEmail(
            assessment.setter.email,
            "Incomplete Assessment Parts Reminder",
            `Reminder: Not all parts of the assessment "${assessment.assessment_name}" are completed. There are currently ${assessment.partSubmissions.length} parts completed out of 8 required. Please ensure all parts are completed as soon as possible.`,
          );
        } catch (error) {}
      }
    }
  }
}

function getOneWeekBeforeJulyFirst() {
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, 5, 24); // June 24 is one week before July 1
}

const startWeek = getOneWeekBeforeJulyFirst();
const firstRun = `${startWeek.getMinutes()} ${startWeek.getHours()} ${startWeek.getDate()} ${startWeek.getMonth() + 1} *`;
schedule(firstRun, () => {
  checkPremarkingPartsFinished();
});

// Continue weekly from that point until the end of the year
schedule("0 0 * * 0", () => {
  checkPremarkingPartsFinished()
    .then(() =>
      console.log("Weekly check for assessment parts completion done."),
    )
    .catch((error) =>
      console.error("Error during weekly assessment parts check:", error),
    );
});

/**
 * This function is for the post-marking stage of assessments.  Part 11 is the
 * final stage of the post-marking process;
 * Part 9: Sample availability
 * Part 10: Internal moderation of marked sample
 * Part 11: Mark and feedback availability
 */
async function checkPostmarkingPartsFinished() {
  const assessments = await prisma.assessment.findMany({
    where: {
      // Choose all assessments which haven't had their final part submitted,
      // but HAS finished stage 1 (i.e. part 8, pre-marking)
      partSubmissions: {
        some: {
          part_id: 8,
        },
        none: {
          part_id: 11,
        },
      },

      // We don't care about archived or completed modules - only those that
      // are currently active
      module: {
        status: "active",
      },
    },
    include: {
      // Setter is for sending the email if the part doesn't have an assignee
      // (which is unlikely)
      setter: true,

      // AssigneesRole is for finding the user who has the role of the part
      // that hasn't been submitted
      assigneesRole: {
        include: {
          user: true,
        },
      },

      // We want to find the last submission to check which part is outstanding
      partSubmissions: {
        // Select the most recent submission
        take: 1,
        orderBy: {
          date_submitted: "desc",
        },

        // And we want to to include the Part of the submission, so we can
        // get the next part from that (which would be the outstanding part)
        include: {
          Part: {
            select: {
              next_part: true,
            },
          },
        },
      },
    },
  });

  for await (const assessment of assessments) {
    const {
      assessment_name,
      assigneesRole,
      hand_in_week: handInDate,
      partSubmissions,
      setter,
    } = assessment;

    // 20 working days (i.e. 4 weeks of; 5 working days + 2 weekend days)
    const overdueDate = new Date(handInDate);
    overdueDate.setDate(handInDate.getDate() + 7 * 4);

    const today = new Date();

    // We only want to compare dates, we don't care about times right now;
    // (h, m, s, ms) + timezone aware
    overdueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // We want to send an email if the assessment is overdue, due today, or
    // due within the next week, regardless of their opt-in status
    const isOverdue = overdueDate.getTime() < today.getTime();
    const isDueToday = overdueDate.getTime() === today.getTime();
    const isDueSoon =
      !isOverdue &&
      !isDueToday &&
      // getTime() returns ms since epoch
      overdueDate.getTime() < today.getTime() + 1000 * 60 * 60 * 24 * 7; // + 7 days

    // There's at least a week (5 working days) to complete the stage,
    // so we can continue onto the next assessment without emailing this
    // assessment
    if (!isDueSoon && !isDueToday && !isOverdue) continue;

    const lastSubmission = partSubmissions.pop();

    // If there are no submissions, then the assessment hasn't even started,
    // let alone passed the first stage, so we can safely skip this assessment
    // and continue to the next assessment
    if (!lastSubmission) continue;

    const nextPart = lastSubmission.Part.next_part;

    if (!nextPart) {
      console.info(
        "Check your 'Part' data - it appears not all parts prior to part 11 have a next part associated with them.",
      );
      continue;
    }

    // We want to send an email to the user whose role is the same as the role
    // for the part that hasn't been submitted
    const assignee = assigneesRole.find((assigneeRole) => {
      // If the last submitted part was part 9, then the next part is part 10,
      // which has the 'Internal moderator' role
      const isRoleForOutstandingPart = assigneeRole.role === nextPart.role;

      // Check if the assignee is assigned to this assessment, which is
      // necessary to send the email
      const belongsToAssessment = assigneeRole.assessment_id === assessment.id;

      return isRoleForOutstandingPart && belongsToAssessment;
    });

    // Decide the urgency of the email
    let urgency: string = "";

    switch (true) {
      case isDueToday:
        urgency = "Urgent - ";
        break;
      case isDueSoon:
        urgency = "Reminder - ";
        break;
      case isOverdue:
        urgency = "Overdue - ";
        break;
    }

    const emailSubject = `${urgency}Release of Marks (${assessment_name})`;

    if (!assignee && !setter) {
      console.info(
        "Unable to send email - no assessment setter found, and no assignee found for outstanding part.",
      );
      continue;
      // TODO: maybe notify PS Team somehow?  Don't exactly want to email all
      // of them at once... Maybe do a random selection?
    } else if (assignee) {
      const canSendToAssignee = !!assignee.user.email;
      if (canSendToAssignee) {
        let message: string;

        switch (true) {
          case isOverdue:
            message = `You still haven't submitted your '${nextPart.part_title}' part for '${assessment_name}'.  Complete this task ASAP.`;
            break;
          case isDueToday:
            message = `'${assessment_name}' marking is due to be released today.  Please make sure to complete your '${nextPart.part_title}' part by the end of the day.`;
            break;
          default:
            message = `'${assessment_name}' marking is due in less than a week (${overdueDate.toDateString()}).  Please complete your '${nextPart.part_title}' part soon.`;
        }

        await sendEmail(
          assignee.user.email,
          emailSubject,
          `Hello ${assignee.user.name},

${message}

Regards,
Assessment Tracking Team`,
        );

        // The email is sent for this assessment, we can continue onto the next
        // assessment
        continue;
      }
      console.info(`User email address not found (ID: ${assignee.user_id})`);
    } else if (setter) {
      // Send an email to the setter that they need to get someone to complete
      // the outstanding part
      const canSendToSetter = !!setter.email;
      if (canSendToSetter) {
        const message = `Hello ${setter.name},

You don't appear to have an assignee for the '${nextPart.part_title}' part of your '${assessment_name}' assessment.
The role needed for this part is: ${nextPart.role.replace(/_/g, " ")}

This email was sent to you because the release of your assessment's marks are ${isOverdue ? "overdue." : isDueToday ? "due today." : "due soon."}

Regards,
Assessment Tracking Team`;

        await sendEmail(setter.email, emailSubject, message);
        continue;
      }
      console.info(`User email address not found (ID: ${setter.id})`);
    }
  }
}

// 09:00AM every weekday
schedule("0 9 * * Mon-Fri", () => {
  checkPostmarkingPartsFinished()
    .then(() => console.info("Finished daily overdue check!"))
    .catch((e) => {
      console.error("Error during daily overdue check:", e);
    });
});
