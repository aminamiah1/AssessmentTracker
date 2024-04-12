import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { constructAssigneeRolesData } from "@/app/utils/assigneeRolesFunctions";
import prisma from "@/app/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const {
      assessment_name,
      assessment_type,
      hand_out_week,
      hand_in_week,
      module_id,
      setter_id,
      externalExaminers,
      internalModerators,
      panelMembers,
    } = await request.json();

    if (
      !assessment_name ||
      !assessment_type ||
      !hand_out_week ||
      !hand_in_week ||
      !module_id ||
      !setter_id ||
      !externalExaminers ||
      !internalModerators ||
      !panelMembers
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields" }),
        { status: 400 },
      );
    }

    //Get module leaders from assessment associated module
    const module = await prisma.module.findUnique({
      where: {
        id: module_id,
      },
      select: {
        module_leaders: {
          select: {
            // Select only the 'id'
            id: true,
          },
        },
      },
    });

    // Construct assigneeRoles data for bulk creation
    const assigneeRolesData = constructAssigneeRolesData(
      externalExaminers,
      internalModerators,
      panelMembers,
      module?.module_leaders,
    );

    if (!assigneeRolesData) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Please make sure assessment module has module leaders assigned.",
        }),
        { status: 400 },
      );
    }

    // Attach assignees to assessment with their specific role for the assessment
    const newAssessment = await prisma.assessment.create({
      data: {
        assessment_name,
        assessment_type,
        hand_out_week,
        hand_in_week,
        module_id,
        setter_id,
        assigneesRole: {
          createMany: {
            data: assigneeRolesData,
            skipDuplicates: true,
          },
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
  }
}
