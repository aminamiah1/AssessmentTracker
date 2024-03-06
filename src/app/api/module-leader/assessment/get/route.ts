import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

//Force api route to dynamically render
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Extract user ID from request query parameters or body
    const url = new URL(request.url);
    const idString = url.searchParams.get("id");
    let id = 0;

    // Check if the assessment ID is missing from the request query
    if (!idString) {
      return new NextResponse(
        JSON.stringify({ message: "Missing assessment ID." }),
        { status: 400 },
      );
    } else {
      id = parseInt(idString, 10);
    }

    // Get assessment with the given ID
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        module: { select: { module_name: true } },
        assignees: { select: { id: true, name: true, roles: true } },
      },
    });

    // Check if assessment was found and return details
    if (assessment) {
      return NextResponse.json(assessment);
    } else {
      console.error("Error retrieving assessment");
      return new NextResponse(
        JSON.stringify({ message: "Error retrieving assessment" }),
        {
          status: 404,
        },
      );
    }
  } catch (error) {
    console.error("Error retrieving assessment:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error internal server error." }),
      {
        status: 500,
      },
    );
  } finally {
    // Close Prisma client connection
    await prisma.$disconnect();
  }
}
