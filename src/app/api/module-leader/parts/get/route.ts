import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Fetch parts with error handling
    const parts = await prisma.part.findMany({
      select: {
        part_title: true,
      },
    });

    return NextResponse.json(parts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve parts" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
