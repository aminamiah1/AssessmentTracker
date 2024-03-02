import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Fetch assessments with error handling
    const assessments = await prisma.assessment.findMany({
      include: {
        assignees: { select: { name: true } },
        setter: { select: { name: true } },
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
    try {
      const assessmentsWithModules = assessments.map((assessment: any) => ({
        ...assessment,
        module_name: moduleNames.find(
          (module: any) => module.id === assessment.module_id,
        )!.module_name,
      }));

      // Return the assessments with the modules as json if successful
      return Response.json(assessmentsWithModules);
    } catch (error) {
      // Else handle the error gracefully
      console.error("Error fetching modules: ", error);
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to retrieve assessments" },
      { status: 500 },
    );
  }
}
