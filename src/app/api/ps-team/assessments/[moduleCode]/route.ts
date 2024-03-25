import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

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
    const assessments = await prisma.assessment.findMany({
      where: {
        module: {
          module_code: moduleCode,
        },
      },
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

    if (assessments.length === 0) {
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

    return new NextResponse(JSON.stringify(assessments), {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
