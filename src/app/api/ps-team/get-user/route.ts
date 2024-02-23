import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

//Force api route to dynamically render
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from request query parameters or body
    const url = new URL(request.url);
    const idString = url.searchParams.get("id");
    const id = parseInt(idString as any, 10);

    // Check if the user ID is missing from the request query
    if (!id) {
      return new NextResponse(JSON.stringify({ message: "Missing user ID." }), {
        status: 400,
      });
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
