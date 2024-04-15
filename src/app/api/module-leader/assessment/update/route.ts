import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
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
      assigneesList,
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
      !assigneesList
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Please include all required fields." }),
        { status: 400 },
      );
    }

    if (typeof proforma_link === "string" && !isProformaLink(proforma_link)) {
      return NextResponse.json(
        { message: "The link provided was not valid, please check the URL." },
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
        proforma_link: true,
      }, // Select desired assignee field
    });

    // Ensure assessment exists
    if (!existingAssessment) {
      return new NextResponse(
        JSON.stringify({ message: "Assessment not found." }),
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
        assessment_name,
        assessment_type,
        hand_out_week,
        hand_in_week,
        module_id,
        setter_id,
        assignees: {
          connect: assigneesIds, //Add on the new assignees
        },
        proforma_link: new_proforma_link,
      }, // Update desired fields
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
