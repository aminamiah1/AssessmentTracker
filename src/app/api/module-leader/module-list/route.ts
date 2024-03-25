import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Extract user ID from request query parameters
  const url = new URL(req.url);
  const idString = url.searchParams.get("userId");
  let userId = 0;

  // Check if the user ID is missing from the request query
  if (!idString) {
    return new NextResponse(JSON.stringify({ message: "Missing user ID." }), {
      status: 400,
    });
  } else {
    userId = parseInt(idString, 10);
  }

  try {
    const session = await getServerSession();
    if (!session) {
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
    // Get modules either by module name, module code, or by module leader name
    let modules;

    // Check if a search term is available for filtering results
    const searchTerm = url.searchParams.get("searchTerm");

    if (searchTerm != null) {
      modules = await prisma.module.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  module_name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  module_code: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  module_leaders: {
                    some: {
                      name: {
                        contains: searchTerm,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            },
            {
              status: "active",
            },
            {
              module_leaders: {
                some: {
                  id: userId,
                },
              },
            },
          ],
        },
        include: {
          module_leaders: true,
        },
      });
    } else {
      modules = await prisma.module.findMany({
        where: {
          status: "active",
          id: userId,
        },
        include: {
          module_leaders: true,
        },
      });
    }
    return NextResponse.json(modules, { status: 200 });
  } catch (error) {
    console.error("Error retrieving modules:\n", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
