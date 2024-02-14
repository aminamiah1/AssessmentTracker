import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Validate and extract userId from query parameters
    const url = new URL(request.url);
    const idString = url.searchParams.get("id");
    const userId = parseInt(idString as any, 10);

    if (!userId) {
      throw new Error("Missing userId query parameter");
    }

    if (isNaN(userId)) {
      throw new Error("Invalid userId format");
    }

    // Fetch assessments with error handling
    const assessments = await prisma.assessment.findMany({
      where: { setter_id: userId },
    });

    return Response.json(assessments);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to retrieve assessments" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
