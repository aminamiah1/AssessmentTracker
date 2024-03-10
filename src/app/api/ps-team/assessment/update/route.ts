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

    const moduleId = existingAssessment.module_id;

    const setter = await prisma.users.findMany({
      where: { id: setter_id },
    });

    // Assign setter to module with assessment if not already assigned
    if (setter !== null) {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
        include: {
          module_leaders: { where: { id: setter_id }, select: { id: true } },
        },
      });

      if (module) {
        if (!module.module_leaders.some((leader) => leader.id === setter_id)) {
          // User is not already a module leader, so connect them
          const assignModule = await prisma.module.update({
            where: { id: moduleId },
            data: {
              module_leaders: {
                connect: setter.map((user) => ({ id: user.id })),
              },
            },
          });
        }
      }
    }

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
