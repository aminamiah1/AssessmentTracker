import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params?: { searchTerm: string[] } },
) {
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
    if (params && Object.keys(params).length > 0) {
      const searchTerm = params.searchTerm[0];
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
