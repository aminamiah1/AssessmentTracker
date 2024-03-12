import { PrismaClient, Role, Assessment_type } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const example_date = new Date(2024, 1, 26);

export default async function () {
  try {
    await seedUsers();
    await seedModules();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedModules() {
  await prisma.module.create({
    data: {
      module_code: "CM3101",
      module_name: "Software Engineering",
      assessments: {
        create: [
          {
            id: 2,
            assessment_name: "Cyber Security",
            assessment_type: "Portfolio",
            hand_in_week: new Date(),
            hand_out_week: new Date(),
            setter_id: 1,
            assignees: {
              connect: [
                {
                  email: "leader@test.net",
                },
                {
                  email: "internal@test.net",
                },
                {
                  email: "external@test.net",
                },
                {
                  email: "panel@test.net",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.module.create({
    data: {
      module_code: "CM6127",
      module_name: "Example Module",
      module_leaders: {
        connect: [{ email: "leader@test.net" }, { email: "sudo@test.net" }],
      },
      assessments: {
        create: {
          id: 1,
          assessment_name: "My new assessment",
          assessment_type: Assessment_type.Portfolio,
          hand_out_week: example_date,
          hand_in_week: example_date,
          setter_id: 1,
        },
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
        name: "Module Leader",
        password,
        roles: [Role.module_leader],
      },
      {
        email: "internal@test.net",
        name: "Internal Moderator",
        password,
        roles: [Role.internal_moderator],
      },
      {
        email: "panel@test.net",
        name: "Panel Member",
        password,
        roles: [Role.panel_member],
      },
      {
        email: "external@test.net",
        name: "External Examiner",
        password,
        roles: [Role.external_examiner],
      },
      {
        email: "ps@test.net",
        name: "PS Team User",
        password,
        roles: [Role.ps_team],
      },
      {
        email: "sysadmin@test.net",
        name: "System Admin User",
        password,
        roles: [Role.system_admin],
      },
      {
        email: "sudo@test.net",
        name: "Super User",
        password,
        roles: [...Object.values(Role)],
      },
    ],
  });
}
