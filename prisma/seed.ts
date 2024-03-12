import seedLiveData from "./seeds/live";
import seedTestData from "./seeds/test";

const { NODE_ENV } = process.env;

async function main() {
  await seedLiveData();

  if (NODE_ENV === "test" || NODE_ENV === "development") {
    console.log("Seeding test data");
    await seedTestData();
  }
}

main().then(() => console.log("Seeding complete"));
