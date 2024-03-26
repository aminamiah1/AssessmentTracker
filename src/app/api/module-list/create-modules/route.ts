import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
        status: 401,
      });
    }

    const { moduleName, moduleCode, moduleLeaderName } = await request.json();

    if (!moduleName || !moduleCode || !moduleLeaderName) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields" }),
        { status: 400 },
      );
    }

    // Querying the database by name to find the valid module leader
    const validModuleLeader = await prisma.users.findMany({
      where: {
        id: { in: moduleLeaderName },
        roles: {
          has: "module_leader",
        },
      },
      select: {
        id: true, // Selecting ID for connecting in module creation
      },
    });

    if (validModuleLeader.length !== moduleLeaderName.length) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid module leader name provided." }),
        { status: 400 },
      );
    }

    // Creating the module with the valid module leader ID
    const newModule = await prisma.module.create({
      data: {
        module_name: moduleName,
        module_code: moduleCode,
        module_leaders: {
          connect: validModuleLeader.map((leader) => ({ id: leader.id })), // Connecting using the validModuleLeader's ID
        },
      },
    });

    return new NextResponse(JSON.stringify(newModule), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
