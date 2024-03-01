import bcrypt from "bcryptjs";
import { PrismaClient, Role, Assessment_type } from "@prisma/client";
import { extname } from "path";

const prisma = new PrismaClient();

//Example date to use for assessment hand out and hand in
const example_date = new Date(2024, 1, 26);

export async function main() {
  await prisma.module.deleteMany();
  await prisma.users.deleteMany();

  await prisma.module.create({
    data: {
      module_code: "CM6127",
      module_name: "Example Module",
    },
  });

  await prisma.users.create({
    data: {
      email: "testemail@test.net",
      name: "Test User",
      password: await bcrypt.hash("securepassword", await bcrypt.genSalt(10)),
      modules: {
        connect: {
          module_code: "CM6127",
        },
      },
      roles: [Role.ps_team, Role.module_leader],
    },
  });

  await prisma.assessment.create({
    data: {
      assessment_name: "My new assessment",
      assessment_type: Assessment_type.Portfolio,
      hand_out_week: example_date,
      hand_in_week: example_date,
      module_id: 1,
      setter_id: 1,
    },
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
