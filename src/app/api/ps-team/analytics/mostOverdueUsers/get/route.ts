import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Get all users with number of overdue assessments
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const users = await prisma.users.findMany({
      select: {
        email: true,
        _count: {
          select: {
            assessments: {
              where: {
                hand_in_week: { lt: new Date() }, // Past the due date
                partSubmissions: {
                  none: { Part: { part_number: { lt: 11 } } }, // No submissions for Part 11 or beyond
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (e) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
