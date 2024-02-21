import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    const {
      assessment_name,
      assessment_type,
      hand_out_week,
      hand_in_week,
      module_id,
      setter_id,
      assigneesList,
    } = await request.json();

    if (
      !assessment_name ||
      !assessment_type ||
      !hand_out_week ||
      !hand_in_week ||
      !module_id ||
      !setter_id ||
      !assigneesList
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields" }),
        { status: 400 },
      );
    }

    const assigneesIds = assigneesList.map((userId: any) => ({ id: userId }));

    const newAssessment = await prisma.assessment.create({
      data: {
        assessment_name,
        assessment_type,
        hand_out_week,
        hand_in_week,
        module_id,
        setter_id,
        assignees: {
          connect: assigneesIds,
        },
      },
    });

    return new NextResponse(JSON.stringify(newAssessment), { status: 200 });
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
