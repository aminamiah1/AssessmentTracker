import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
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

  try {
    const { id, name, email, password, roles } = await request.json();

    // Validate mandatory fields
    if (!id || !name || !email || !password || !roles) {
      return new NextResponse(
        JSON.stringify({
          message: "ID, name, email, password and roles are required",
        }),
        { status: 400 },
      );
    }

    // Locate the user by ID
    const existingUser = await prisma.users.findUnique({ where: { id } });

    // Ensure user exists
    if (!existingUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Update user data
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { name, email, password, roles }, // Update desired fields
    });

    // Return updated user data
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  } finally {
    // Close Prisma client connection
    await prisma.$disconnect();
  }
}
