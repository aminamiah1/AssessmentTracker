import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get modules either by module name, module code, or by module leader name
    const modules = await prisma.module.findMany();
    return NextResponse.json(modules, { status: 200 });
  } catch (error) {
    console.error("Error retrieving modules:\n", error);
    return NextResponse.json([], { status: 200 });
  }
}
