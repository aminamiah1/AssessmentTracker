import { PrismaClient } from "@prisma/client";
import seedLiveData from "./seeds/live";
import seedTestData from "./seeds/test";

const prisma = new PrismaClient();

const { NODE_ENV } = process.env;

async function main() {
  if (NODE_ENV === "test" || NODE_ENV === "development") {
    await seedTestData(prisma);
  } else if (NODE_ENV === "production") {
    await seedLiveData(prisma);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
