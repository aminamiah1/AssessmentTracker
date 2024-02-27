import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      // If there is no session, the user is unauthenticated
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    try {
      // Get modules either by module name, module code, or by module leader name
      const modules = await prisma.module.findMany();
      return NextResponse.json(modules, { status: 200 });
    } catch (error) {
      console.error("Error retrieving modules:\n", error);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
