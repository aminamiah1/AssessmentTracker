import { PrismaClient, Role, Assessment_type } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({ log: ["query"] });

const example_date = new Date(2024, 3, 29);

export default async function () {
  try {
    await seedUsers();
    await seedModules();
    await seedParts();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Please do not use manual ids for the assessments as this caused errors with postgresql internal sequencing
async function seedModules() {
  // First module declared, assessments declared later due to order needed for tests to work
  await prisma.module.create({
    data: {
      module_code: "CM3101",
      module_name: "Software Engineering",
    },
  });

  // Second module declared
  await prisma.module.create({
    data: {
      module_code: "CM6127",
      module_name: "Example Module",
      module_leaders: {
        connect: [{ email: "leader@test.net" }, { email: "sudo@test.net" }],
      },
      assessments: {
        create: {
          assessment_name: "My new assessment",
          assessment_type: Assessment_type.Portfolio,
          hand_out_week: example_date,
          hand_in_week: example_date,
          setter_id: 1,
        },
      },
    },
  });

  // Assessments for first module declared after to keep test friendly auto ids assigned
  await prisma.assessment.create({
    data: {
      assessment_name: "Cyber Security",
      assessment_type: "Portfolio",
      proforma_link:
        "https://cf.sharepoint.com/:b:/r/teams/ProformaFiles/Shared%20Documents/General/Proforma%20Example%202.pdf?csf=1&web=1&e=1JYTFd",
      hand_in_week: new Date(),
      hand_out_week: new Date(),
      setter_id: 1,
      module_id: 1,
      assigneesRole: {
        create: [
          { role: Role.module_leader, user_id: 1 },
          { role: Role.internal_moderator, user_id: 2 },
          { role: Role.external_examiner, user_id: 4 },
          { role: Role.panel_member, user_id: 3 },
        ],
      },
    },
  });

  await prisma.assessment.create({
    data: {
      assessment_name: "Database Design",
      assessment_type: Assessment_type.Practical_Based_Assessment,
      hand_in_week: example_date,
      hand_out_week: example_date,
      setter_id: 1,
      module_id: 1,
      proforma_link:
        "https://cf.sharepoint.com/:b:/r/teams/ProformaFiles/Shared%20Documents/General/Proforma%20Example%202.pdf?csf=1&web=1",
      assigneesRole: {
        create: [
          { role: Role.module_leader, user_id: 1 },
          { role: Role.internal_moderator, user_id: 2 },
          { role: Role.external_examiner, user_id: 4 },
          { role: Role.panel_member, user_id: 3 },
        ],
      },
    },
  });

  await prisma.module.create({
    data: {
      module_code: "CM8264",
      module_name: "Module To Archive",
      module_leaders: {
        connect: [{ email: "leader@test.net" }, { email: "sudo@test.net" }],
      },
    },
  });

  await prisma.module.create({
    data: {
      module_code: "CM9155",
      module_name: "Archived Module",
      module_leaders: {
        connect: [{ email: "leader@test.net" }],
      },
      status: "archived",
    },
  });

  // Data used in assessment progress bar test suite to seperate testing enviroment from todo test suite
  await prisma.module.create({
    data: {
      module_code: "CM6122",
      module_name: "Python Apps",
      module_leaders: {
        connect: [{ email: "leader2@test.net" }, { email: "sudo@test.net" }],
      },
      assessments: {
        createMany: {
          data: [
            {
              assessment_name: "Python Fundamentals",
              assessment_type: Assessment_type.Portfolio,
              hand_out_week: example_date,
              hand_in_week: example_date,
              setter_id: 8,
            },
            {
              assessment_name: "Python Advanced",
              assessment_type: Assessment_type.Portfolio,
              hand_out_week: example_date,
              hand_in_week: example_date,
              setter_id: 8,
            },
            {
              assessment_name: "Python Next Level",
              assessment_type: Assessment_type.Portfolio,
              hand_out_week: new Date(),
              // Get hand in date a two months from current date
              hand_in_week: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 2,
                new Date().getDate(),
              ),
              setter_id: 8,
            },
          ],
        },
      },
    },
  });

  // Data used in module block test
  await prisma.module.create({
    data: {
      module_code: "CM6133",
      module_name: "Python Apps 2",
      module_leaders: {
        connect: [{ email: "leader3@test.net" }],
      },
      assessments: {
        createMany: {
          data: [
            {
              assessment_name: "Python Fundamentals 2",
              assessment_type: Assessment_type.Portfolio,
              hand_out_week: example_date,
              hand_in_week: example_date,
              setter_id: 8,
            },
            {
              assessment_name: "Python Advanced 2",
              assessment_type: Assessment_type.Portfolio,
              hand_out_week: example_date,
              hand_in_week: example_date,
              setter_id: 8,
            },
            {
              assessment_name: "Python Next Level 2",
              assessment_type: Assessment_type.Portfolio,
              hand_out_week: example_date,
              hand_in_week: example_date,
              setter_id: 8,
            },
          ],
        },
      },
    },
  });

  // Data used in create assessment test
  await prisma.module.create({
    data: {
      module_code: "CM6135",
      module_name: "Python Apps 3",
      module_leaders: {
        connect: [{ email: "leader4@test.net" }],
      },
    },
  });
}

async function seedUsers() {
  const password = await bcrypt.hash(
    "securepassword",
    await bcrypt.genSalt(10),
  );

  await prisma.users.createMany({
    data: [
      {
        email: "leader@test.net",
        mustResetPassword: false,
        name: "Liam Leader",
        password,
        roles: [Role.module_leader],
        status: "active",
      },
      {
        email: "internal@test.net",
        mustResetPassword: false,
        name: "Ian Internal",
        password,
        roles: [Role.internal_moderator],
        status: "active",
      },
      {
        email: "panel@test.net",
        mustResetPassword: false,
        name: "Paul Panel",
        password,
        roles: [Role.panel_member],
        status: "active",
      },
      {
        email: "external@test.net",
        mustResetPassword: false,
        name: "External Eric",
        password,
        roles: [Role.external_examiner],
        status: "active",
      },
      {
        email: "ps@test.net",
        mustResetPassword: false,
        name: "PS Penelope",
        password,
        roles: [Role.ps_team],
        status: "active",
      },
      {
        email: "sysadmin@test.net",
        mustResetPassword: false,
        name: "Sarah Sys-Tem Admin",
        password,
        roles: [Role.system_admin],
        status: "active",
      },
      {
        email: "sudo@test.net",
        mustResetPassword: false,
        name: "Sam Super",
        password,
        roles: [...Object.values(Role)],
        status: "active",
      },
      {
        email: "leader2@test.net",
        mustResetPassword: false,
        name: "Larry Leader",
        password,
        roles: [...Object.values(Role)],
        status: "active",
      },
      {
        email: "leader3@test.net",
        mustResetPassword: false,
        name: "Levi Leader",
        password,
        roles: [Role.module_leader],
        status: "active",
      },
      {
        email: "leader4@test.net",
        mustResetPassword: false,
        name: "Lemmy Leader",
        password,
        roles: [Role.module_leader],
        status: "active",
      },
      {
        email: "newuser@test.net",
        mustResetPassword: true,
        name: "New User",
        password,
        roles: [Role.module_leader],
        status: "active",
      },
    ],
  });
}

async function seedParts() {
  await prisma.partSubmission.create({
    data: {
      part_id: 4,
      date_submitted: new Date(),
      assessment_id: 4,
      submitted_by: 8,
    },
  });
  await prisma.partSubmission.create({
    data: {
      part_id: 6,
      date_submitted: new Date(),
      assessment_id: 5,
      submitted_by: 8,
    },
  });
  await prisma.partSubmission.create({
    data: {
      part_id: 11,
      date_submitted: new Date(),
      assessment_id: 7,
      submitted_by: 8,
    },
  });
  await prisma.partSubmission.create({
    data: {
      part_id: 10,
      date_submitted: new Date(),
      assessment_id: 9,
      submitted_by: 8,
    },
  });
}
