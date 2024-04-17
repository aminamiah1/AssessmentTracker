import prisma from "@/app/db";
import {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "@/app/utils/emailService";
import { hashPassword } from "@/app/utils/hashPassword";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const parseRoles = (rolesArray: string[]): Role[] => {
  return rolesArray
    .map((role) => role.trim().replace(/\s+/g, "_").toLowerCase())
    .filter((role): role is Role => Object.values(Role).includes(role as Role));
};

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
      status: 401,
    });
  }

  try {
    const usersData = await request.json();
    for (const userData of usersData) {
      const { email, name, password, roles } = userData;
      if (typeof password === "undefined") {
        console.error("Password is undefined for user:", email);
        continue;
      }

      const hashedPassword = await hashPassword(password);
      const roleEnums = parseRoles(roles);

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        const oldPassword = existingUser.password;

        const passwordChanged = !(await bcrypt.compare(password, oldPassword));

        await prisma.users.update({
          where: { email },
          data: {
            name,
            password: hashedPassword,
            roles: { set: roleEnums },
            mustResetPassword:
              // If they already had to reset their password,
              // we don't want to overwrite this with 'false'
              existingUser.mustResetPassword || passwordChanged,
          },
        });

        if (passwordChanged) {
          await sendPasswordResetEmail(email, name, password);
        }
      } else {
        await prisma.users.create({
          data: {
            email,
            name,
            password: hashedPassword,
            roles: { set: roleEnums },
            mustResetPassword: true,
          },
        });

        await sendWelcomeEmail(email, name, roleEnums, password);
      }
    }

    return new NextResponse(
      JSON.stringify({ message: "Users created/updated successfully!" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Failed to create/update users:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
