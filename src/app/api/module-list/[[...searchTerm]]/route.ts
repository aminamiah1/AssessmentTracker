import prisma from "@/app/db";
import { ModuleStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params?: { searchTerm: string[] } },
) {
  const searchParams = req.nextUrl.searchParams;

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

  // Get the filters from the query in the URL
  // in the form ?active=:boolean&archived=:boolean&completed=:boolean
  function getFilterParam(filter: string) {
    const filterParam = searchParams.get(filter);
    return filterParam === "true";
  }

  // Gets the active query ?active=
  const useActiveFilter = getFilterParam("active");
  // Gets the archived query &archived=
  const useArchiveFilter = getFilterParam("archived");
  // Gets the completed query &completed=
  const useCompletedFilter = getFilterParam("completed");

  // If a filter is active, use the filter when doing the search
  const filters = [];
  if (useActiveFilter) filters.push({ status: ModuleStatus.active });
  if (useArchiveFilter) filters.push({ status: ModuleStatus.archived });
  if (useCompletedFilter) filters.push({ status: ModuleStatus.completed });

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
              OR: filters,
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
          OR: filters,
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
