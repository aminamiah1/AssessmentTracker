const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const example_date = new Date(2024, 1, 26);

//To add example test data insert script
async function createResponse() {
  const response = await prisma.assessment.create({
    data: {
      assessment_name: "Group Coding Project",
      assessment_type: "Group",
      hand_out_week: example_date,
      hand_in_week: example_date,
      module_id: 1,
    },
  });
}

createResponse()
  .catch((error) => {
    console.error("Error creating reponse:", error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
