import { markPartAsSubmitted } from "@/app/utils/form";
import { NextRequest, NextResponse } from "next/server";
import { handleErrors } from "../errors";

export async function POST(
  request: NextRequest,
  { params }: { params: { assessmentId: string } },
) {
  try {
    const { assessmentId } = params;

    const errorResponse = await handleErrors(assessmentId);
    if (errorResponse) return errorResponse;

    const body = await request.json();

    await markPartAsSubmitted(+assessmentId, body.partId, body.responses);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 },
    );
  }
}
