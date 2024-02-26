import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.part.upsert({
    where: { id: -1 },
    update: {},
    create: {
      id: -1,
      part_title: "Test",
      part_number: 1,
      Question: {
        create: [
          {
            question_title: "What is your name?",
            response_type: "string",
          },
          {
            question_title: "Do you use email?",
            response_type: "boolean",
          },
          {
            question_title: "What's your favourite color?",
            response_type: "string",
            choices: ["Red", "Blue", "Green", "Yellow"],
          },
        ],
      },
    },
  });
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
