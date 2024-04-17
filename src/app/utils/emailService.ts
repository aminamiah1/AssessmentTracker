import dotenv from "dotenv";
dotenv.config();

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error("One or more API Keys not set.  Not sending email.");
  }

  const msg = {
    to: to,
    from: process.env.EMAIL_FROM as string,
    subject: subject,
    text: text,
  };

  if (process.env.NODE_ENV === "test") return;

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  password: string,
) {
  try {
    await sendEmail(
      email,
      "Password Reset",
      `Hi ${name},

Your password has been reset to: ${password}

When logging back into your account, you will be prompted to reset this password for security reasons.

Thanks,
Assessment Tracking Team`,
    );
  } catch (e) {
    console.error(`Error sending password reset email to ${email}: ${e}`);
  }
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  roles: string[],
  password: string,
) {
  try {
    await sendEmail(
      email,
      "Welcome to Assessment Tracker",
      `Welcome, ${name}!
  
You have been invited as:
- ${roles.map((role) => role.replace(/_/g, " ").toUpperCase()).join("\r\n- ")}

Your password has been set: ${password}

For security reasons, you will be prompted to reset this password when you initially sign in.

We hope you enjoy your assessment tracking experience!`,
    );
  } catch (e) {
    console.error(`Error sending welcome email to ${email}: ${e}`);
  }
}
