import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../db";

//Force api route to dynamically render
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Extract user ID from request query parameters or body
    const url = new URL(request.url);
    const idString = url.searchParams.get("id");
    let id = 0;

    // Check if the user ID is missing from the request query
    if (!idString) {
      return new NextResponse(JSON.stringify({ message: "Missing user ID." }), {
        status: 400,
      });
    } else {
      id = parseInt(idString as any, 10);
    }

    // Get user with the given ID
    const user = await prisma.users.findUnique({ where: { id } });

    // Check if user was found and return details
    if (user) {
      return Response.json(user);
    } else {
      console.error("Error retrieving user");
      return new NextResponse(
        JSON.stringify({ message: "Error retrieving user" }),
        {
          status: 404,
        },
      );
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
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
