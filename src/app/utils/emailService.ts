import dotenv from "dotenv";
dotenv.config();

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(to: string, subject: string, text: string) {
  const msg = {
    to: to,
    from: process.env.EMAIL_FROM as string,
    subject: subject,
    text: text,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
