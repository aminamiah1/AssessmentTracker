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
      select: {
        id: true,
        assessment_name: true,
        assessment_type: true,
        hand_out_week: true,
        hand_in_week: true,
        module_id: true,
        assignees: { select: { name: true } }, // Select desired assignee field
      },
    });

    // Fetch module names using Prisma
    const moduleNames = await prisma.module.findMany({
      where: {
        id: { in: assessments.map((assessment: any) => assessment.module_id) },
      },
      select: { id: true, module_name: true },
    });

    // Map module names to assessments
    const assessmentsWithModules = assessments.map((assessment: any) => ({
      ...assessment,
      module_name: moduleNames.find(
        (module: any) => module.id === assessment.module_id,
      )?.module_name,
    }));

    return Response.json(assessmentsWithModules);
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
