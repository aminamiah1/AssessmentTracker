import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, roles } = await request.json();
    if (!name || !email || !password || !roles) {
      return new NextResponse(
        JSON.stringify({
          message: "Name, email, password and roles are required",
        }),
        { status: 400 },
      );
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User already exists" }),
        { status: 400 },
      );
    }

    const newUser = await prisma.users.create({
      data: { name, email, password, roles: roles },
    });

    return new NextResponse(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  } finally {
    // Close Prisma client connection
    await prisma.$disconnect();
  }
}
