import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Get all users
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    const users = await prisma.users.findMany();
    return NextResponse.json(users);
  } catch (e) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
