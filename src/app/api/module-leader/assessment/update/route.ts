import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { constructAssigneeRolesData } from "@/app/utils/assigneeRolesFunctions";
import prisma from "@/app/db";
import {
  isProformaLink,
  removeQueryParams,
} from "@/app/utils/checkProformaLink";

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
      proforma_link,
    } = await request.json();

    let new_proforma_link = proforma_link;
    if (proforma_link) {
      new_proforma_link = removeQueryParams(proforma_link);
    }

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
        JSON.stringify({ message: "Please include all required fields." }),
        { status: 400 },
      );
    }

    if (
      proforma_link &&
      typeof proforma_link === "string" &&
      !isProformaLink(proforma_link)
    ) {
      return NextResponse.json(
        { message: "The link provided was not valid, please check the URL." },
        { status: 400 },
      );
    }

    // Locate the assessment by ID
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
      select: {
        id: true,
        setter_id: true,
        assessment_name: true,
        assessment_type: true,
        hand_out_week: true,
        hand_in_week: true,
        module_id: true,
        ...(new_proforma_link && { proforma_link: new_proforma_link }), // Conditional inclusion
      },
    });

    // Ensure assessment exists
    if (!existingAssessment) {
      return new NextResponse(
        JSON.stringify({ message: "Assessment not found." }),
        { status: 404 },
      );
    }

    // Get module leaders from assessment associated module
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

    // Send error message to frontend if assessment does not have module leaders assigned
    if (!assigneeRolesData) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Please make sure assessment module has module leaders assigned.",
        }),
        { status: 400 },
      );
    }

    // Get all user ids
    const allUserIds = [
      ...externalExaminers,
      ...internalModerators,
      ...panelMembers,
    ].map((user) => user.value);

    // Delete assessment roles for users outside of the sent updated assignee list
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
        proforma_link: new_proforma_link,
        setter_id:
          roleName === "module_leader"
            ? setter_id // Keep the provided setter_id if role is 'module_leader'
            : existingAssessment.setter_id || module?.module_leaders?.[0]?.id, // Use existing setter or first module leader if ps team
        assigneesRole: {
          upsert: assigneeRolesData.map((roleData) => ({
            where: {
              // Unique identifer to check if existing assignee already exists for assessment
              user_id_assessment_id: {
                user_id: roleData.user_id,
                assessment_id: id,
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
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
