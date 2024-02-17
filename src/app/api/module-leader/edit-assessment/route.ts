import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const {
      id,
      assessment_name,
      assessment_type,
      hand_out_week,
      hand_in_week,
      module_id,
      setter_id,
      assigneesList,
    } = await request.json();

    // Validate mandatory fields
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

    // Locate the assessment by ID
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
      select: {
        id: true,
        assessment_name: true,
        assessment_type: true,
        hand_out_week: true,
        hand_in_week: true,
        module_id: true,
        assignees: { select: { id: true } },
      }, // Select desired assignee field
    });

    // Ensure user exists
    if (!existingAssessment) {
      return new NextResponse(
        JSON.stringify({ message: "Assessment not found" }),
        { status: 404 },
      );
    }

    const takeOffExistingAssignees = await prisma.assessment.update({
      where: { id },
      data: {
        assignees: {
          disconnect: existingAssessment.assignees, // This disconnects existing assignees
        },
      },
    });

    // Update user data
    const updatedAssessment = await prisma.assessment.update({
      where: { id },
      data: {
        assessment_name,
        assessment_type,
        hand_out_week,
        hand_in_week,
        module_id,
        setter_id,
        assignees: {
          connect: assigneesIds, //Add on the new assignees
        },
      }, // Update desired fields
    });

    // Return updated user data
    return new NextResponse(JSON.stringify(updatedAssessment), { status: 200 });
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
