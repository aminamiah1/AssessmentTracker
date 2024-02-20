import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.roles !== "ps_team") {
      // If there is no session, the user is unauthenticated
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }

  // Get all users
  try {
    const users = await prisma.users.findMany();
    return Response.json(users);
  } finally {
    await prisma.$disconnect(); // Ensure connection closure
  }
}
