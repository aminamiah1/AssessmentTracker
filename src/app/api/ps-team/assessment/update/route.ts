import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

// API route function to handle the updating of assessment data(assignees and setter only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const { id, setter_id, assigneesList } = await request.json();

    // Validate mandatory fields
    if (!id || !setter_id || !assigneesList) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields" }),
        { status: 400 },
      );
    }

    const assigneesIds = assigneesList.map((userId: any) => ({ id: userId }));

    // Locate the existing assessment by ID
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        assignees: { select: { id: true } },
      }, // Select desired assignee field
    });

    // Ensure assessment exists
    if (!existingAssessment) {
      return new NextResponse(
        JSON.stringify({ message: "Assessment not found" }),
        { status: 404 },
      );
    }

    // Take off the existing connected assignees to the assessment
    const takeOffExistingAssignees = await prisma.assessment.update({
      where: { id },
      data: {
        assignees: {
          disconnect: existingAssessment.assignees, // This disconnects existing assignees
        },
      },
    });

    // Update assessment data
    const updatedAssessment = await prisma.assessment.update({
      where: { id },
      data: {
        setter_id,
        assignees: {
          connect: assigneesIds, //Add on the new assignees
        },
      }, // Update desired fields
    });

    // Return updated assessment data
    return new NextResponse(JSON.stringify(updatedAssessment), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
