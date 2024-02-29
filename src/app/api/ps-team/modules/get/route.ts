import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Fetch assessments with error handling
    const modules = await prisma.module.findMany({
      select: {
        id: true,
        module_name: true,
      },
    });

    return Response.json(modules);
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
