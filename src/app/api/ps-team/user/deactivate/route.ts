import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";

export async function POST(NextRequest: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Extract user ID from request query parameters or body
    const { id } = await NextRequest.json();

    // Validate user ID
    if (!id) {
      return new NextResponse(JSON.stringify({ message: "Missing user ID." }), {
        status: 400,
      });
    }

    // Deactivate user with the given ID
    try {
      await prisma.users.update({
        where: {
          id,
        },
        data: {
          status: UserStatus.inactive,
        },
      });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: "Error updating user status." }),
        {
          status: 500,
        },
      );
    }

    // Respond with success message or redirect
    return new NextResponse(
      JSON.stringify({ message: "User deactivation successful!" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deactivating user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error internal server error." }),
      {
        status: 500,
      },
    );
  }
}
