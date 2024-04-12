import { NextRequest, NextResponse } from "next/server";
import { handleErrors } from "../errors";
import { partsForAssessment } from "./logic";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { assessmentId: string } },
) {
  try {
    const { assessmentId } = params;

    const errorResponse = await handleErrors(assessmentId);
    if (errorResponse) return errorResponse;

    const getAll = request.nextUrl.searchParams.get("all") === "true";

    const todos = await partsForAssessment(+assessmentId, {
      onlyCurrentPart: !getAll,
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve assessment's todo list" },
      { status: 500 },
    );
  }
}
