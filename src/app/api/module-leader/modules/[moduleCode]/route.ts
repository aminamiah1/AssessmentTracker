import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";

// Adapted from PS team get modules by module code route
export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split("/");
  const module_code = segments[segments.length - 1];

  try {
    if (!module_code) {
      return new NextResponse(
        JSON.stringify({ error: "Module code not provided" }),
        { status: 400 },
      );
    }

    const moduleData = await prisma.module.findUnique({
      where: {
        module_code: module_code,
      },
      include: {
        module_leaders: true,
        assessments: true,
      },
    });

    if (!moduleData) {
      return new NextResponse(JSON.stringify({ message: "Module not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(moduleData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error retrieving module:", error);

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
