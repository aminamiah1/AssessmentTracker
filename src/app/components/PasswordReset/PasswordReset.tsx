"use server";

import { getServerSession } from "next-auth";
import db from "@/app/db";
import { DialogForm } from "./DialogForm";

export async function PasswordReset({}) {
  const session = await getServerSession();

  if (!session || !session.user.email) return <></>;

  const user = (await db.users.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      mustResetPassword: true,
    },
  }))!;

  // User must have already reset their password
  if (!user.mustResetPassword) return <></>;

  return <DialogForm />;
}
