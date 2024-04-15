import { schedule } from "node-cron";
import { sendEmail } from "../src/app/utils/emailService";
import prisma from "@/app/db";

export async function checkAssessmentsAndSendEmails() {
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
  checkAssessmentsAndSendEmails();
});

// Continue weekly from that point until the end of the year
schedule("0 0 * * 0", () => {
  checkAssessmentsAndSendEmails()
    .then(() =>
      console.log("Weekly check for assessment parts completion done."),
    )
    .catch((error) =>
      console.error("Error during weekly assessment parts check:", error),
    );
});
