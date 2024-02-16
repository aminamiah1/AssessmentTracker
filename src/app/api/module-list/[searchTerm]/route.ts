import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { searchTerm: string } },
) {
  const prisma = new PrismaClient();

  try {
    // Get modules either by module name, module code, or by module leader name
    const modules = await prisma.module.findMany({
      where: {
        OR: [
          {
            module_name: {
              contains: params.searchTerm,
            },
          },
          {
            module_code: {
              contains: params.searchTerm,
            },
          },
          {
            module_leaders: {
              some: {
                name: {
                  contains: params.searchTerm,
                },
              },
            },
          },
        ],
      },
    });
    return NextResponse.json(modules, { status: 200 });
  } catch (error) {
    console.error("Error retrieving modules:\n", error);
    return NextResponse.json([], { status: 200 });
  }
}
