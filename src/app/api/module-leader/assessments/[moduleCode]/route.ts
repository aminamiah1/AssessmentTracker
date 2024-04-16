import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

// Adapted from PS team get assessments by module code route
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const pathname = req.nextUrl.pathname;
  const segments = pathname.split("/");
  const moduleCode = segments[segments.length - 1];

  if (!moduleCode) {
    return new NextResponse(
      JSON.stringify({ error: "Module code is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    // Fetch assessments by setter with error handling with last part submission and assignees
    const assessments = await prisma.assessment.findMany({
      where: {
        module: {
          module_code: moduleCode,
        },
      },
      include: {
        // Get assessment specific role for assignees
        assigneesRole: {
          select: {
            role: true,
            user: {
              select: { name: true, email: true, id: true },
            },
          },
        },
        setter: { select: { name: true, id: true, roles: true } },
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

    // Tie to assessments
    const assessmentsWithModules = assessments.map((assessment: any) => ({
      ...assessment,
      module_name: moduleNames.find(
        (module: any) => module.id === assessment.module_id,
      )!.module_name,
      // Send assignees as the front end expects with role just for this assessment
      assignees: assessment.assigneesRole.map((assigneeRole: any) => ({
        name: assigneeRole.user.name,
        email: assigneeRole.user.email,
        role: assigneeRole.role,
      })),
    }));

    if (assessmentsWithModules.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No assessments found for this module code" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return NextResponse.json(assessmentsWithModules);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to retrieve assessments" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
