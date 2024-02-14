import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Get all assessments
  try {
    const assessments = await prisma.assessment.findMany();
    return Response.json(assessments);
  } finally {
    await prisma.$disconnect(); // Ensure connection closure
  }
}
