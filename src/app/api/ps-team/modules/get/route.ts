import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Fetch modules with error handling
    const modules = await prisma.module.findMany({
      select: {
        id: true,
        module_name: true,
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
