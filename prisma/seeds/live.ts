import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function () {
  try {
    await seedParts();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedParts() {
  /**
   * SECTION 1:
   * - First 3 parts are section 1: "Internal peer moderation"
   */
  await prisma.part.create({
    data: {
      id: 1,
      part_title: "Assessment availability",
      role: "module_leader",
      part_number: 1,
      Question: {
        create: [
          {
            question_title:
              "Draft assessment and marking criteria/guidelines placed on Assessment Team by setter, and moderator notified",
            response_type: "boolean",
          },
          {
            question_title:
              "Copy of last year's assessment available in last year's folder for comparison",
            response_type: "boolean",
          },
          {
            question_title:
              "Summary of marking plan (i.e. rough estimate of how long each student will take to mark, no. students, dates available to mark and confirmation you will be able to complete marking by the deadline (with assistance if necessary)",
            response_type: "string",
          },
          {
            question_title:
              "Summary of changes to the assessment (i.e. what has changed since last year)",
            response_type: "string",
          },
        ],
      },
    },
  });
  await prisma.part.create({
    data: {
      id: 2,
      part_title: "Internal moderator comments",
      role: "internal_moderator",
      part_number: 2,
      previous_part: {
        connect: {
          id: 1,
        },
      },
      Question: {
        create: [
          {
            question_title:
              "The link between learning outcomes and assessment activities is clear",
            response_type: "boolean",
          },
          {
            question_title:
              "The activities to be completed as part of the assessment are clear and appropriate",
            response_type: "boolean",
          },
          {
            question_title:
              "The criteria to be used to assign marks to parts of the assessment are clear and appropriate",
            response_type: "boolean",
          },
          {
            question_title:
              "If appropriate for the type of assessment, the requirements for each grade classification are clear",
            response_type: "boolean",
          },
          {
            question_title:
              "The amount of work being undertaken is fair given the relative weighting of the assessment to the overall module",
            response_type: "boolean",
          },
          {
            question_title: "The assessment is free from mistakes",
            response_type: "boolean",
          },
          {
            question_title: "The assessment uses the current proforma template",
            response_type: "boolean",
          },
          {
            question_title: "Submission arrangements are clearly stated",
            response_type: "boolean",
          },
          {
            question_title: "Penalties for incorrect submissions are stated",
            response_type: "boolean",
          },
          {
            question_title: "Feedback return date and method clearly stated",
            response_type: "boolean",
          },
          {
            question_title: "The marking plan is proportionate and achievable",
            response_type: "boolean",
          },
          {
            question_title: "Comment on any actions required",
            response_type: "string",
          },
          {
            question_title:
              "Does the assessment differ sufficiently from last year's to require scrutiny by the moderation panel?",
            response_type: "boolean",
          },
          {
            question_title: "Assessment moderated and passed to module leader",
            response_type: "boolean",
          },
        ],
      },
    },
  });
  await prisma.part.create({
    // To be completed by the setter
    data: {
      id: 3,
      part_title: "Response to internal moderation",
      role: "module_leader",
      part_number: 3,
      previous_part: {
        connect: {
          id: 2,
        },
      },

      Question: {
        create: [
          {
            question_title: "Response to moderator's comments in part 2",
            response_type: "string",
          },
          {
            question_title:
              "Edits made and assessment placed in assessment team by setter",
            response_type: "boolean",
          },
          {
            // TODO: This should trigger an email?
            question_title:
              "Assessment moderation panel notified by adding details to tracking spreadsheet in assessment team",
            response_type: "boolean",
          },
        ],
      },
    },
  });

  /**
   * SECTION 2:
   * - Parts 4 & 5
   */
  await prisma.part.create({
    data: {
      id: 4,
      part_title: "Moderation panel comments",
      role: "panel_member",
      part_number: 4,
      previous_part: {
        connect: {
          id: 3,
        },
      },
      Question: {
        create: [
          {
            question_title:
              "Assessment considered by assessment moderation panel",
            response_type: "boolean",
          },
          {
            question_title:
              "Feedback from assessment panel and actions required",
            response_type: "string",
          },
          {
            question_title: "Assessment status",
            response_type: "string",
            choices: [
              "Approved",
              "Approved subject to minor modification (see above)",
              "To be reconsidered in light of comments (see above)",
              "To be re-sent to panel after modification",
            ],
          },
          {
            question_title: "Module leader notified of panel feedback",
            response_type: "boolean",
          },
          {
            question_title: "Moderator and setter notified of panel feedback",
            response_type: "boolean",
          },
        ],
      },
    },
  });
  await prisma.part.create({
    // To be completed by the setter
    data: {
      id: 5,
      part_title: "Response to moderation panel",
      role: "module_leader",
      part_number: 5,
      previous_part: {
        connect: {
          id: 4,
        },
      },
      Question: {
        create: [
          {
            question_title:
              "Response to assessment panel feedback and actions in part 4",
            response_type: "string",
          },
          {
            question_title:
              "Edits made and updated assessment placed in Assessment Team by setter",
            response_type: "boolean",
          },
          {
            question_title:
              "(IF REQUIRED) Assessment sent to external examiner",
            response_type: "boolean",
          },
        ],
      },
    },
  });

  /**
   * SECTION 3:
   * - parts 6, 7 & 8
   */
  await prisma.part.create({
    data: {
      id: 6,
      part_title: "External examiner feedback",
      role: "external_examiner",
      part_number: 6,
      previous_part: {
        connect: {
          id: 5,
        },
      },
      Question: {
        create: [
          {
            question_title: "Assessment status",
            response_type: "string",
            choices: [
              "Approved",
              "Approved subject to minor modification (see below)",
              "To be reconsidered in light of comments (see below)",
              "To be re-sent to external after modification",
            ],
          },
          {
            question_title:
              "Feedback from external examiner and actions required",
            response_type: "string",
          },
        ],
      },
    },
  });
  await prisma.part.create({
    // To be completed by the setter
    data: {
      id: 7,
      part_title: "Response to external examiner feedback",
      role: "module_leader",
      part_number: 7,
      previous_part: {
        connect: {
          id: 6,
        },
      },
      Question: {
        create: [
          {
            question_title:
              "Response to external examiner's feedback and actions in part 6",
            response_type: "string",
          },
          {
            question_title:
              "Edits made and assessment placed in Assessment Team by setter",
            response_type: "boolean",
          },
          {
            question_title: "Assessment ready for handing out to students",
            response_type: "boolean",
          },
        ],
      },
    },
  });
  await prisma.part.create({
    data: {
      id: 8,
      part_title: "External examiner feedback monitoring",
      role: "external_examiner",
      part_number: 8,
      previous_part: {
        connect: {
          id: 7,
        },
      },
      Question: {
        create: [
          {
            question_title: "External's comments passed to DLT and A&F lead",
            response_type: "boolean",
          },
          {
            question_title:
              "Documentation passed to Year Tutor/Programme Leader",
            response_type: "boolean",
          },
        ],
      },
    },
  });

  /**
   * SECTION 4:
   * - parts 9 & 10
   */
  await prisma.part.create({
    data: {
      id: 9,
      part_title: "Sample availability",
      role: "module_leader",
      part_number: 9,
      previous_part: {
        connect: {
          id: 8,
        },
      },
      Question: {
        create: [
          {
            question_title:
              "Sample of marked assessment submissions and feedback placed in Assessment Team and moderator notified of availability",
            response_type: "boolean",
          },
          {
            // TODO: This should trigger an email?
            question_title:
              "Assessment panel notified of availability of post-marking moderation sample",
            response_type: "boolean",
          },
          {
            question_title:
              "Sample provided covers all failures and appropriate number of assessments from across mark distribution",
            response_type: "boolean",
          },
        ],
      },
    },
  });
  await prisma.part.create({
    // After this part is completed, it goes back to the module leader
    data: {
      id: 10,
      part_title: "Internal moderation of marked sample",
      role: "internal_moderator",
      part_number: 10,
      previous_part: {
        connect: {
          id: 9,
        },
      },
      Question: {
        create: [
          {
            question_title: "Marking is consistent across the sample",
            response_type: "boolean",
          },
          {
            question_title: "Marking is in line with provided marking criteria",
            response_type: "boolean",
          },
          {
            question_title:
              "Clear feedback has been provided to each student indicating where and how their work meets/fails to meet the elements of the marking criteria",
            response_type: "boolean",
          },
          {
            question_title:
              "Clear feedback has been provided to each student indicating where work could be improved (to feed forward to future assessments)",
            response_type: "boolean",
          },
          {
            question_title: "Comment on any actions required",
            response_type: "string",
          },
          {
            question_title:
              "Assessment marking and feedback passed to module leader",
            response_type: "boolean",
          },
        ],
      },
    },
  });

  /**
   * SECTION 5:
   * - part 11
   */
  await prisma.part.create({
    data: {
      id: 11,
      part_title: "Mark and feedback availability",
      role: "module_leader",
      part_number: 11,
      previous_part: {
        connect: {
          id: 10,
        },
      },
      Question: {
        create: [
          {
            question_title:
              "Assessment marks either released to students or marked prior to exam board",
            response_type: "boolean",
          },
          {
            question_title: "Assessment feedback released to students",
            response_type: "boolean",
          },
          {
            question_title: "Assessment marks entered into Learning Central",
            response_type: "boolean",
          },
          {
            question_title:
              "Assessment marks transferred from Learning Central into SIMS",
            response_type: "boolean",
          },
          {
            question_title: "Assessment feedback entered into Learning Central",
            response_type: "boolean",
          },
          {
            question_title: "Cohort feedback returned to students",
            response_type: "boolean",
          },
        ],
      },
    },
  });
}
