import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all users
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        roles: true,
      },
    });
    return NextResponse.json(users);
  } finally {
    await prisma.$disconnect(); // Ensure connection closure
  }
}
