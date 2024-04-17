"use server";

import db from "@/app/db";
import { getServerSession } from "next-auth";
import { hashPassword } from "../utils/hashPassword";
import bcrypt from "bcrypt";

export async function changePasswordAndResetFlag(newPassword: string) {
  const session = await getServerSession();

  if (!session) throw new Error("No session found");
  if (!session.user.email) throw new Error("Email not found");

  const { email } = session.user;

  const currentUser = await db.users.findUniqueOrThrow({
    where: {
      email,
    },
    select: {
      password: true,
    },
  });

  const usingSamePassword = await bcrypt.compare(
    newPassword,
    currentUser.password,
  );

  if (usingSamePassword) throw new Error("Invalid password provided");

  // No point hashing the password until we know it's valid
  const hashedPassword = await hashPassword(newPassword);

  await db.users.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
      mustResetPassword: false,
    },
  });
}
