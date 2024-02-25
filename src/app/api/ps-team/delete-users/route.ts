import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../db";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Extract user ID from request query parameters or body
    const { id } = await request.json();

    // Validate user ID
    if (!id) {
      return new NextResponse(JSON.stringify({ message: "Missing user ID." }), {
        status: 400,
      });
    }

    // Delete user with the given ID
    const deletedUser = await prisma.users.delete({ where: { id: id } });

    // Check if user was found and deleted
    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User is deleted!" }), {
        status: 200,
      });
    }

    // Respond with success message or redirect
    return new NextResponse(
      JSON.stringify({ message: "User deletion successful!" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deleting user:", error);
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
