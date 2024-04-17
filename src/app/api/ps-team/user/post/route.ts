import prisma from "@/app/db";
import { sendWelcomeEmail } from "@/app/utils/emailService";
import { hashPassword } from "@/app/utils/hashPassword";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const { name, email, password, roles } = await request.json();
    if (!name || !email || !password || !roles) {
      return new NextResponse(
        JSON.stringify({
          message: "Name, email, password and roles are required",
        }),
        { status: 400 },
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User already exists" }),
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        mustResetPassword: true,
        password: hashedPassword,
        roles,
      },
    });

    await sendWelcomeEmail(email, name, roles, password);

    return new NextResponse(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
