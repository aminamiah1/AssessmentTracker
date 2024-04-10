import { Role } from "@prisma/client";
import { SelectOption } from "@/app/types/interfaces";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
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
      psTeamMembers,
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
      !panelMembers ||
      !psTeamMembers
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields" }),
        { status: 400 },
      );
    }

    // Construct assigneeRoles data for bulk creation
    const assigneeRolesData = [
      ...externalExaminers.map((user: SelectOption) => ({
        user_id: user.value,
        role: Role.external_examiner,
      })),
      ...internalModerators.map((user: SelectOption) => ({
        user_id: user.value,
        role: Role.internal_moderator,
      })),
      ...panelMembers.map((user: SelectOption) => ({
        user_id: user.value,
        role: Role.panel_member,
      })),
      ...psTeamMembers.map((user: SelectOption) => ({
        user_id: user.value,
        role: Role.ps_team,
      })),
      {
        user_id: setter_id,
        role: Role.module_leader,
      },
    ];

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
