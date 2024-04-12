import { saveResponse } from "@/app/utils/server/form";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { handleErrors } from "../../errors";
import prisma from "@/app/db";

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
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

async function handleAllErrors(
  assessmentId: string,
  questionId: string,
): Promise<NextResponse | undefined> {
  const errorResponse = await handleErrors(
    assessmentId,
    async (session: Session) => {
      let message: string | undefined;
      const part = await prisma.part.findFirst({
        where: {
          Question: {
            some: {
              id: +questionId,
            },
          },
        },
      });
      if (!part) message = "No part found for question";
      else if (!session.user.roles.includes(part.role))
        message = "Unauthorised";
      return message;
    },
  );
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
