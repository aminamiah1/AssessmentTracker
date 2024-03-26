import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Fetch assessments with error handling
    const assessments = await prisma.assessment.findMany({
      include: {
        assignees: { select: { id: true, name: true, roles: true } },
        setter: { select: { id: true, name: true, roles: true } },
        partSubmissions: {
          select: { Part: true },
          orderBy: { part_id: "desc" },
          take: 1,
        },
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
      return NextResponse.json(assessmentsWithModules);
    } catch (error) {
      // Else handle the error gracefully
      console.error("Error fetching modules: ", error);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve assessments" },
      { status: 500 },
    );
  }
}
