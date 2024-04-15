import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";
import { sendEmail } from "@/app/utils/emailService";

async function parseJson(request: NextRequest) {
  try {
    const body = await request.text();
    return JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON input");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Assuming you have set up the auth options correctly for session handling
    const session = await getServerSession();

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
        status: 401,
      });
    }

    const parsedBody = await parseJson(request);
    const optIn = parsedBody.optIn;

    // Convert user ID from string to number safely
    const userId = parseInt(session.user.id); //the use of sessioning prevents other users inferring with other users data
    if (isNaN(userId)) {
      throw new Error("Invalid user ID: ID must be a number");
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.update({
        where: { id: userId },
        data: { isOptedInForEmails: optIn },
      });
      return user.email;
    });

    const emailSubject = optIn ? "Opt-In Confirmation" : "Opt-Out Confirmation";
    const emailBody = optIn ? "You have opted in..." : "You have opted out...";

    await sendEmail(transaction, emailSubject, emailBody);

    return new NextResponse(
      JSON.stringify({ message: "Opt-in status updated", email: transaction }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  }
}
