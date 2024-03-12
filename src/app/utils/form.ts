"use server";
import prisma from "../db";

export async function getPartsWithQuestions(): Promise<PartWithQuestions[]> {
  const parts = await prisma.part.findMany({
    include: {
      Question: true,
    },
  });

  return parts;
}

export async function getBulkResponsesForPart(
  assessmentIds: number[],
  partIds: number[],
): Promise<{ [key: number]: QuestionWithResponse[] }> {
  console.assert(assessmentIds.length === partIds.length);

  const responses = await prisma.question.findMany({
    include: {
      Response: true,
    },
    where: {
      AND: [
        {
          part_id: {
            in: partIds,
          },
        },
        {
          Response: {
            some: {
              assessment_id: { in: assessmentIds },
            },
          },
        },
      ],
    },
  });

  const sortedResponses: { [key: number]: QuestionWithResponse[] } = {};

  responses.forEach((response) => {
    if (!sortedResponses[response.Response[0].assessment_id]) {
      sortedResponses[response.Response[0].assessment_id] = [];
    }

    sortedResponses[response.Response[0].assessment_id].push(response);
  });

  return sortedResponses;
}

export async function getResponsesForPart(
  assessmentId: number,
  partId: number,
): Promise<QuestionWithResponse[]> {
  const responses = prisma.question.findMany({
    include: {
      Response: true,
    },
    where: {
      part_id: partId,
      Response: {
        some: {
          assessment_id: assessmentId,
        },
      },
    },
  });

  return responses;
}

/**
 * Once a part is submitted, we don't want the user to be able to change their
 * responses - this function will keep track of WHEN a part was submitted; responses
 * have their own date_completed field which is ONLY updated when the response is saved
 * @param assessmentId The assessment to which the part belongs
 * @param partId The part to be marked as submitted
 * @param frontendResponses The responses that the user THINKS they've saved
 */
export async function markPartAsSubmitted(
  assessmentId: number,
  partId: number,
  frontendResponses: { [key: string]: FormDataEntryValue },
): Promise<void> {
  const backendResponses = await getResponsesForPart(assessmentId, partId);

  // We want to make sure that all questions have responses
  verifyAllQuestionsAreAnswered(backendResponses);

  // We want to make sure that there aren't any discrepancies in data between
  // what the user THINKS they've saved, and what we actually have stored in
  // the backend - this will throw an error if there are any discrepancies
  verifyResponsesMatch(backendResponses, frontendResponses);

  await prisma.partSubmission.create({
    data: {
      assessment_id: assessmentId,
      part_id: partId,
    },
  });
}

function verifyAllQuestionsAreAnswered(responses: QuestionWithResponse[]) {
  responses.forEach((response) => {
    if (!response.Response.length || !response.Response[0].value) {
      throw new Error("All questions must be answered");
    }
  });
}

function verifyResponsesMatch(
  backendResponses: QuestionWithResponse[],
  frontendResponses: { [key: string]: FormDataEntryValue },
) {
  backendResponses.forEach((response) => {
    const frontendResponse = frontendResponses[response.id.toString()];

    // We know a response will exist, because we're verifying that all
    // questions have been answered
    if (frontendResponse !== response.Response[0].value) {
      throw new Error("Responses do not match");
    }
  });
}
