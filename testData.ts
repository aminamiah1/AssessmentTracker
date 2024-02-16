const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const example_date = new Date(2024, 1, 26);

//To add example test data insert script
async function createResponse() {
  const response = await prisma.response.create({
    data: {
      value: "true",
      data_type: "boolean",
      assessment_id: 1,
      question_id: 2
    },
  });
}

createResponse()
  .catch((error) => {
    console.error('Error creating reponse:', error);
  })
  .finally(() => {
    prisma.$disconnect();
});