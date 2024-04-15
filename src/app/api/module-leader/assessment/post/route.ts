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
      return NextResponse.json(
        { error: "Must be logged in." },
        { status: 401 },
      );
    }

    const {
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
        proforma_link: new_proforma_link,
      },
    });

    return new NextResponse(JSON.stringify(newAssessment), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 },
    );
  }
}
