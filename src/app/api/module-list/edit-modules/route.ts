import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
      status: 401,
    });
  }

  const { moduleId, moduleName, moduleCode, moduleLeaderNames } =
    await request.json();
  if (!moduleId) {
    return new NextResponse(
      JSON.stringify({ error: "Module ID is required for updating" }),
      { status: 400 },
    );
  }

  const parsedModuleId = parseInt(moduleId, 10); // Parse moduleId to integer

  const existingModule = await prisma.module.findUnique({
    where: { id: parsedModuleId },
  });
  if (!existingModule) {
    return new NextResponse(JSON.stringify({ error: "Module not found" }), {
      status: 404,
    });
  }

  const updatePayload: Record<string, any> = {};

  if (moduleName !== undefined) {
    updatePayload.module_name = moduleName;
  }

  if (moduleCode !== undefined) {
    updatePayload.module_code = moduleCode;
  }

  if (moduleLeaderNames !== undefined) {
    const parsedLeaderIds: number[] = moduleLeaderNames.map((id: string) =>
      parseInt(id, 10),
    ); // Parse each leader ID to integer

    const validModuleLeaders = await prisma.users.findMany({
      where: {
        id: { in: parsedLeaderIds },
        roles: { has: "module_leader" },
      },
      select: { id: true },
    });

    if (validModuleLeaders.length !== parsedLeaderIds.length) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid module leader name(s) provided." }),
        { status: 400 },
      );
    }

    updatePayload.module_leaders = {
      set: [],
      connect: validModuleLeaders.map((leader) => ({ id: leader.id })),
    };
  }

  try {
    await prisma.module.update({
      where: { id: parsedModuleId },
      data: updatePayload,
    });
    return new NextResponse(
      JSON.stringify({ message: "Module updated successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating module:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
