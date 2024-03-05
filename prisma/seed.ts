import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

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
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
