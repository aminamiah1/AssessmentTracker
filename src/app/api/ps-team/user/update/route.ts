import prisma from "@/app/db";
import { sendPasswordResetEmail } from "@/app/utils/emailService";
import { hashPassword } from "@/app/utils/hashPassword";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const { id, name, email, password, roles } = await request.json();

    // Validate mandatory fields
    if (!id || !name || !email || !password || !roles) {
      return new NextResponse(
        JSON.stringify({
          message: "ID, name, email, password and roles are required",
        }),
        { status: 400 },
      );
    }

    // Locate the user by ID
    const existingUser = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        mustResetPassword: true,
        password: true,
      },
    });

    // Ensure user exists
    if (!existingUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const oldPassword = existingUser.password;

    const passwordChanged = !(await bcrypt.compare(password, oldPassword));
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Update user data
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        name,
        email,
        mustResetPassword: existingUser.mustResetPassword || passwordChanged,
        password: hashedPassword,
        roles,
      },
    });

    if (passwordChanged) {
      await sendPasswordResetEmail(email, name, password);
    }

    // Return updated user data
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
