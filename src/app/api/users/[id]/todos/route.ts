import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { todosForUser } from "@/app/utils/server/assessment";

/**
 *
 * @param request
 * @returns
 * @todo The plan is to implement functionality so that, when a PS Team
 * member requests this endpoint without arguments, they can get ALL users'
 * todos(?)'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    const { id } = params;

    if (!session) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const errorResponse = handleErrors(id);
    if (errorResponse) return errorResponse;

    const userId: number = parseInt(id);

    let partsToReturn: AssessmentAndPartAPIResponse[] = [];
    // When getting a user's list, we'll be getting MANY parts -
    // i.e. they could be assigned to many different assessments
    partsToReturn = await todosForUser(userId, session.user.roles);

    return NextResponse.json(partsToReturn!);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve user's todo list" },
      { status: 500 },
    );
  }
}

function handleErrors(idParam: string): NextResponse | undefined {
  let message: string = "";
  switch (true) {
    case !idParam:
      message = "No 'userId' query parameter provided";
      break;
    case idParam && isNaN(+idParam):
      message = `Invalid 'userId' format: '${idParam}'`;
      break;
    default:
      break;
  }

  if (message) {
    return new NextResponse(JSON.stringify({ message }), { status: 400 });
  }
}
