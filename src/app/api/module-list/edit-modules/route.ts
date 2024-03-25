import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

export async function POST(request: NextRequest) {
  try {
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

    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        module_leaders: true,
      },
    });

    if (!existingModule) {
      return new NextResponse(JSON.stringify({ error: "Module not found" }), {
        status: 404,
      });
    }

    if (!moduleName || !moduleCode || !moduleLeaderNames) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields" }),
        { status: 400 },
      );
    }

    const validModuleLeaders = await prisma.users.findMany({
      where: {
        name: { in: moduleLeaderNames },
        roles: {
          has: "module_leader",
        },
      },
      select: {
        id: true,
      },
    });

    if (validModuleLeaders.length !== moduleLeaderNames.length) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid module leader name(s) provided." }),
        { status: 400 },
      );
    }

    await prisma.module.update({
      where: { id: moduleId },
      data: {
        module_leaders: {
          set: [],
        },
      },
    });

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        module_name: moduleName,
        module_code: moduleCode,
        module_leaders: {
          connect: validModuleLeaders.map((leader) => ({ id: leader.id })),
        },
      },
    });

    return new NextResponse(JSON.stringify({ existingModule, updatedModule }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}

//TODO: frontend
