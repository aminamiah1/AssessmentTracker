import { saveResponse } from "@/app/utils/server/form";
import { NextRequest, NextResponse } from "next/server";
import { handleErrors } from "../../errors";

/**
 *
 * @param request
 * @returns
 * @todo The plan is to implement functionality so that, when a PS Team
 * member requests this endpoint without arguments, they can get ALL users'
 * todos(?)'
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { assessmentId: string; questionId: string } },
) {
  try {
    const { assessmentId, questionId } = params;

    const errorResponse = await handleAllErrors(assessmentId, questionId);
    if (errorResponse) return errorResponse;

    const { newValue } = await request.json();
    await saveResponse(+assessmentId, +questionId, newValue);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 },
    );
  }
}

async function handleAllErrors(
  assessmentId: string,
  questionId: string,
): Promise<NextResponse | undefined> {
  const errorResponse = await handleErrors(assessmentId);
  if (errorResponse) return errorResponse;

  let message: string = "";
  switch (true) {
    case !questionId:
      message = "No 'questionId' query parameter provided";
      break;
    case questionId && isNaN(+questionId):
      message = "Invalid 'questionId' format";
      break;
    default:
      break;
  }

  if (message) {
    return new NextResponse(JSON.stringify({ message }), { status: 400 });
  }
}
