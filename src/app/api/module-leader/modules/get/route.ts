import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { ModuleStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Validate and extract userId from query parameters
    const url = new URL(request.url);
    const idString = url.searchParams.get("id");
    let userId = 0;

    // Check if the user ID is missing from the request query
    if (!idString) {
      return new NextResponse(JSON.stringify({ message: "Missing user ID." }), {
        status: 400,
      });
    } else {
      userId = parseInt(idString, 10);
    }

    if (!userId) {
      throw new Error("Missing userId query parameter");
    }

    if (isNaN(userId)) {
      throw new Error("Invalid userId format");
    }

    // Fetch assessments with error handling
    const modules = await prisma.users.findMany({
      where: { id: userId },
      select: {
        modules: {
          where: {
            // Only get active modules showing
            status: ModuleStatus.active,
          },
        },
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve assessments" },
      { status: 500 },
    );
  }
}
