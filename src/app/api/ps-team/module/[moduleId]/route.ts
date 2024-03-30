import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split("/");
  const moduleIdString = segments[segments.length - 1];
  const moduleId = parseInt(moduleIdString, 10);

  if (isNaN(moduleId)) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid module ID provided" }),
      { status: 400 },
    );
  }

  try {
    const module = await prisma.module.findUnique({
      where: {
        id: moduleId,
      },
      include: {
        module_leaders: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!module) {
      return new NextResponse(JSON.stringify({ error: "Module not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(module), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error retrieving module by ID:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to retrieve module details" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
