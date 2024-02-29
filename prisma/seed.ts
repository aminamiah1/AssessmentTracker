import { PrismaClient } from "@prisma/client";
import seedLiveData from "./seeds/live";
import seedTestData from "./seeds/test";

const { NODE_ENV } = process.env;

async function main() {
  if (NODE_ENV === "test" || NODE_ENV === "development") {
    await seedTestData(new PrismaClient());
  } else if (NODE_ENV === "production") {
    await seedLiveData();
  }
}

main().then(() => console.log("Seeding complete"));
