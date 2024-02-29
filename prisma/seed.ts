import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import seedLiveData from "./seeds/live";
import seedTestData from "./seeds/test";

const prisma = new PrismaClient();

const { NODE_ENV } = process.env;

async function main() {
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
      roles: [Role.ps_team],
    },
  });

  if (NODE_ENV === "test" || NODE_ENV === "development") {
    await seedTestData(new PrismaClient());
  } else if (NODE_ENV === "production") {
    await seedLiveData();
  }
}

main().then(() => console.log("Seeding complete"));
