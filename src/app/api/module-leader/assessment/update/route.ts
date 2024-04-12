import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { SelectOption } from "@/app/types/interfaces";
import { Role } from "@prisma/client";
import prisma from "@/app/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const {
      id,
      assessment_name,
      assessment_type,
      hand_out_week,
      hand_in_week,
      module_id,
      setter_id,
      externalExaminers,
      internalModerators,
      panelMembers,
      roleName,
    } = await request.json();

    // Validate mandatory fields
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
      !roleName
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields" }),
        { status: 400 },
      );
    }

    // Locate the assessment by ID
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
    });

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
      // Add module leader as setter conditionally if sent by a module leader else keep setter the same
      ...(roleName === "module_leader"
        ? [{ user_id: setter_id, role: Role.module_leader }]
        : [
            {
              user_id: existingAssessment?.setter_id,
              role: Role.module_leader,
            },
          ]),
    ];

    // Ensure assessment exists
    if (!existingAssessment) {
      return new NextResponse(
        JSON.stringify({ message: "Assessment not found" }),
        { status: 404 },
      );
    }

    // Get all users
    const allUserIds = [
      ...externalExaminers,
      ...internalModerators,
      ...panelMembers,
    ].map((user) => user.value);

    // Delete roles for users outside of the updated assignee list
    await prisma.assigneeRole.deleteMany({
      where: {
        assessment_id: id,
        NOT: {
          user_id: { in: allUserIds },
        },
      },
    });

    // Update assessment data
    const updatedAssessment = await prisma.assessment.update({
      where: { id },
      data: {
        assessment_name,
        assessment_type,
        hand_out_week,
        hand_in_week,
        module_id,
        setter_id:
          roleName === "module_leader"
            ? setter_id
            : existingAssessment.setter_id, // Set new setter id only if module leader role type
        assigneesRole: {
          upsert: assigneeRolesData.map((roleData) => ({
            where: {
              // Unique identifer to check if existing assignee with role already exists for assessment
              user_id_assessment_id_role: {
                user_id: roleData.user_id,
                assessment_id: id,
                role: roleData.role,
              },
            },
            update: { role: roleData.role },
            create: roleData,
          })),
        },
      },
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
