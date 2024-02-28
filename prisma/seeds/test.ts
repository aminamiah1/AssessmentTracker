import { PrismaClient } from "@prisma/client";

export default async function (prisma: PrismaClient) {
  await prisma.part.upsert({
    where: { id: -1 },
    update: {},
    create: {
      id: -1,
      part_title: "Test",
      role: "ps_team",
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
