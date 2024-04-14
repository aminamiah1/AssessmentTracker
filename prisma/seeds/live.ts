import { hashPassword } from "../../src/app/utils/hashPassword";
import { PrismaClient } from "@prisma/client";
import { generate } from "generate-passphrase";

const prisma = new PrismaClient();

export default async function () {
  try {
    await seedParts();

    // Only seed the super user in production
    if (
      process.env.NODE_ENV === "test" ||
      process.env.NODE_ENV === "development"
    )
      return;

    await seedSuperUser();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedSuperUser() {
  // Using a passphrase generator instead of a password generator
  // because it's easier to remember and more secure
  const password = generate({ length: 6, numbers: false });
  const hashedPassword = await hashPassword(password);
  const email = `${generate({ length: 1, numbers: false })}@su.com`;

  await prisma.users.upsert({
    create: {
      id: 1,
      email,
      name: "Super Admin",
      roles: ["ps_team", "system_admin"],
      password: hashedPassword,
    },
    update: {},
    where: {
      id: 1,
    },
  });

  // This should output only to the environment in which the server
  // is running - emailing it to a user opens up a security risk.
  // And if there's a malicious user in the system that can see the
  // logs... well we've got a bigger issue on our hands than a leaked
  // website password :^)
  console.log(email, password);
}

async function seedParts() {
  /**
   * SECTION 1:
   * - First 3 parts are section 1: "Internal peer moderation"
   */
  await prisma.part.upsert({
    create: {
      id: 1,
      part_title: "Assessment availability",
      role: "module_leader",
      part_number: 1,
      Question: {
        connectOrCreate: [
          {
            create: {
              id: 1,
              question_title:
                "Draft assessment and marking criteria/guidelines placed on Assessment Team by setter, and moderator notified",
              response_type: "boolean",
            },
            where: {
              id: 1,
            },
          },
          {
            create: {
              id: 2,
              question_title:
                "Copy of last year's assessment available in last year's folder for comparison",
              response_type: "boolean",
            },
            where: {
              id: 2,
            },
          },
          {
            create: {
              id: 3,
              question_title:
                "Summary of marking plan (i.e. rough estimate of how long each student will take to mark, no. students, dates available to mark and confirmation you will be able to complete marking by the deadline (with assistance if necessary)",
              response_type: "string",
            },
            where: {
              id: 3,
            },
          },
          {
            create: {
              id: 4,
              question_title:
                "Summary of changes to the assessment (i.e. what has changed since last year)",
              response_type: "string",
            },
            where: {
              id: 4,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 1,
    },
  });
  await prisma.part.upsert({
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 5,
              question_title:
                "The link between learning outcomes and assessment activities is clear",
              response_type: "boolean",
            },
            where: {
              id: 5,
            },
          },
          {
            create: {
              id: 6,
              question_title:
                "The activities to be completed as part of the assessment are clear and appropriate",
              response_type: "boolean",
            },
            where: {
              id: 6,
            },
          },
          {
            create: {
              id: 7,
              question_title:
                "The criteria to be used to assign marks to parts of the assessment are clear and appropriate",
              response_type: "boolean",
            },
            where: {
              id: 7,
            },
          },
          {
            create: {
              id: 8,
              question_title:
                "If appropriate for the type of assessment, the requirements for each grade classification are clear",
              response_type: "boolean",
            },
            where: {
              id: 8,
            },
          },
          {
            create: {
              id: 9,
              question_title:
                "The amount of work being undertaken is fair given the relative weighting of the assessment to the overall module",
              response_type: "boolean",
            },
            where: {
              id: 9,
            },
          },
          {
            create: {
              id: 10,
              question_title: "The assessment is free from mistakes",
              response_type: "boolean",
            },
            where: {
              id: 10,
            },
          },
          {
            create: {
              id: 11,
              question_title:
                "The assessment uses the current proforma template",
              response_type: "boolean",
            },
            where: {
              id: 11,
            },
          },
          {
            create: {
              id: 12,
              question_title: "Submission arrangements are clearly stated",
              response_type: "boolean",
            },
            where: {
              id: 12,
            },
          },
          {
            create: {
              id: 13,
              question_title: "Penalties for incorrect submissions are stated",
              response_type: "boolean",
            },
            where: {
              id: 13,
            },
          },
          {
            create: {
              id: 14,
              question_title: "Feedback return date and method clearly stated",
              response_type: "boolean",
            },
            where: {
              id: 14,
            },
          },
          {
            create: {
              id: 15,
              question_title:
                "The marking plan is proportionate and achievable",
              response_type: "boolean",
            },
            where: {
              id: 15,
            },
          },
          {
            create: {
              id: 16,
              question_title: "Comment on any actions required",
              response_type: "string",
            },
            where: {
              id: 16,
            },
          },
          {
            create: {
              id: 17,
              question_title:
                "Does the assessment differ sufficiently from last year's to require scrutiny by the moderation panel?",
              response_type: "boolean",
            },
            where: {
              id: 17,
            },
          },
          {
            create: {
              id: 18,
              question_title:
                "Assessment moderated and passed to module leader",
              response_type: "boolean",
            },
            where: {
              id: 18,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 2,
    },
  });
  await prisma.part.upsert({
    // To be completed by the setter
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 19,
              question_title: "Response to moderator's comments in part 2",
              response_type: "string",
            },
            where: {
              id: 19,
            },
          },
          {
            create: {
              id: 20,
              question_title:
                "Edits made and assessment placed in assessment team by setter",
              response_type: "boolean",
            },
            where: {
              id: 20,
            },
          },
          {
            // TODO: This should trigger an email?
            create: {
              id: 21,
              question_title:
                "Assessment moderation panel notified by adding details to tracking spreadsheet in assessment team",
              response_type: "boolean",
            },
            where: {
              id: 21,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 3,
    },
  });

  /**
   * SECTION 2:
   * - Parts 4 & 5
   */
  await prisma.part.upsert({
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 22,
              question_title:
                "Assessment considered by assessment moderation panel",
              response_type: "boolean",
            },
            where: {
              id: 22,
            },
          },
          {
            create: {
              id: 23,
              question_title:
                "Feedback from assessment panel and actions required",
              response_type: "string",
            },
            where: {
              id: 23,
            },
          },
          {
            create: {
              id: 24,
              question_title: "Assessment status",
              response_type: "string",
              choices: [
                "Approved",
                "Approved subject to minor modification (see above)",
                "To be reconsidered in light of comments (see above)",
                "To be re-sent to panel after modification",
              ],
            },
            where: {
              id: 24,
            },
          },
          {
            create: {
              id: 25,
              question_title: "Module leader notified of panel feedback",
              response_type: "boolean",
            },
            where: {
              id: 25,
            },
          },
          {
            create: {
              id: 26,
              question_title: "Moderator and setter notified of panel feedback",
              response_type: "boolean",
            },
            where: {
              id: 26,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 4,
    },
  });
  await prisma.part.upsert({
    // To be completed by the setter
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 27,
              question_title:
                "Response to assessment panel feedback and actions in part 4",
              response_type: "string",
            },
            where: {
              id: 27,
            },
          },
          {
            create: {
              id: 28,
              question_title:
                "Edits made and updated assessment placed in Assessment Team by setter",
              response_type: "boolean",
            },
            where: {
              id: 28,
            },
          },
          {
            create: {
              id: 29,
              question_title:
                "(IF REQUIRED) Assessment sent to external examiner",
              response_type: "boolean",
            },
            where: {
              id: 29,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 5,
    },
  });

  /**
   * SECTION 3:
   * - parts 6, 7 & 8
   */
  await prisma.part.upsert({
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 30,
              question_title: "Assessment status",
              response_type: "string",
              choices: [
                "Approved",
                "Approved subject to minor modification (see below)",
                "To be reconsidered in light of comments (see below)",
                "To be re-sent to external after modification",
              ],
            },
            where: {
              id: 30,
            },
          },
          {
            create: {
              id: 31,
              question_title:
                "Feedback from external examiner and actions required",
              response_type: "string",
            },
            where: {
              id: 31,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 6,
    },
  });
  await prisma.part.upsert({
    // To be completed by the setter
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 32,
              question_title:
                "Response to external examiner's feedback and actions in part 6",
              response_type: "string",
            },
            where: {
              id: 32,
            },
          },
          {
            create: {
              id: 33,
              question_title:
                "Edits made and assessment placed in Assessment Team by setter",
              response_type: "boolean",
            },
            where: {
              id: 33,
            },
          },
          {
            create: {
              id: 34,
              question_title: "Assessment ready for handing out to students",
              response_type: "boolean",
            },
            where: {
              id: 34,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 7,
    },
  });
  await prisma.part.upsert({
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 35,
              question_title: "External's comments passed to DLT and A&F lead",
              response_type: "boolean",
            },
            where: {
              id: 35,
            },
          },
          {
            create: {
              id: 36,
              question_title:
                "Documentation passed to Year Tutor/Programme Leader",
              response_type: "boolean",
            },
            where: {
              id: 36,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 8,
    },
  });

  /**
   * SECTION 4:
   * - parts 9 & 10
   */
  await prisma.part.upsert({
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 37,
              question_title:
                "Sample of marked assessment submissions and feedback placed in Assessment Team and moderator notified of availability",
              response_type: "boolean",
            },
            where: {
              id: 37,
            },
          },
          {
            // TODO: This should trigger an email?
            create: {
              id: 38,
              question_title:
                "Assessment panel notified of availability of post-marking moderation sample",
              response_type: "boolean",
            },
            where: {
              id: 38,
            },
          },
          {
            create: {
              id: 39,
              question_title:
                "Sample provided covers all failures and appropriate number of assessments from across mark distribution",
              response_type: "boolean",
            },
            where: {
              id: 39,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 9,
    },
  });
  await prisma.part.upsert({
    // After this part is completed, it goes back to the module leader
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 40,
              question_title: "Marking is consistent across the sample",
              response_type: "boolean",
            },
            where: {
              id: 40,
            },
          },
          {
            create: {
              id: 41,
              question_title:
                "Marking is in line with provided marking criteria",
              response_type: "boolean",
            },
            where: {
              id: 41,
            },
          },
          {
            create: {
              id: 42,
              question_title:
                "Clear feedback has been provided to each student indicating where and how their work meets/fails to meet the elements of the marking criteria",
              response_type: "boolean",
            },
            where: {
              id: 42,
            },
          },
          {
            create: {
              id: 43,
              question_title:
                "Clear feedback has been provided to each student indicating where work could be improved (to feed forward to future assessments)",
              response_type: "boolean",
            },
            where: {
              id: 43,
            },
          },
          {
            create: {
              id: 44,
              question_title: "Comment on any actions required",
              response_type: "string",
            },
            where: {
              id: 44,
            },
          },
          {
            create: {
              id: 45,
              question_title:
                "Assessment marking and feedback passed to module leader",
              response_type: "boolean",
            },
            where: {
              id: 45,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 10,
    },
  });

  /**
   * SECTION 5:
   * - part 11
   */
  await prisma.part.upsert({
    create: {
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
        connectOrCreate: [
          {
            create: {
              id: 46,
              question_title:
                "Assessment marks either released to students or marked prior to exam board",
              response_type: "boolean",
            },
            where: {
              id: 46,
            },
          },
          {
            create: {
              id: 47,
              question_title: "Assessment feedback released to students",
              response_type: "boolean",
            },
            where: {
              id: 47,
            },
          },
          {
            create: {
              id: 48,
              question_title: "Assessment marks entered into Learning Central",
              response_type: "boolean",
            },
            where: {
              id: 48,
            },
          },
          {
            create: {
              id: 49,
              question_title:
                "Assessment marks transferred from Learning Central into SIMS",
              response_type: "boolean",
            },
            where: {
              id: 49,
            },
          },
          {
            create: {
              id: 50,
              question_title:
                "Assessment feedback entered into Learning Central",
              response_type: "boolean",
            },
            where: {
              id: 50,
            },
          },
          {
            create: {
              id: 51,
              question_title: "Cohort feedback returned to students",
              response_type: "boolean",
            },
            where: {
              id: 51,
            },
          },
        ],
      },
    },
    update: {},
    where: {
      id: 11,
    },
  });
}
