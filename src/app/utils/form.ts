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

export async function getResponsesForPart(
  assessmentId: number,
  partId: number,
): Promise<ResponseWithQuestion[]> {
  const responses = await prisma.response.findMany({
    include: {
      Question: true,
    },
    where: {
      assessment_id: assessmentId,
      Question: {
        part_id: partId,
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
  frontendResponses: Map<string, FormDataEntryValue>,
): Promise<void> {
  const backendResponses = await getResponsesForPart(assessmentId, partId);

  // We want to make sure that there aren't any discrepancies in data between
  // what the user THINKS they've saved, and what we actually have stored in
  // the backend - this will throw an error if there are any discrepancies
  verifyResponsesMatch(backendResponses, frontendResponses);

  // We want to make sure that all questions have responses
  verifyAllQuestionsAreAnswered(backendResponses);

  await prisma.partSubmission.create({
    data: {
      assessment_id: assessmentId,
      part_id: partId,
    },
  });
}

/**
 * For saving individual responses as the user goes through the tracking
 * form - they can save their progress and come back to it later
 * @param assessmentId The assessment to which the response belongs
 * @param questionId The question to which the response belongs
 * @param value The response value
 */
export async function saveResponse(
  assessmentId: number,
  questionId: number,
  value: string,
) {
  await prisma.response.upsert({
    where: {
      // Using a compound key for responses - see schema
      assessment_id_question_id: {
        assessment_id: assessmentId,
        question_id: questionId,
      },
    },
    // Date completed will be automatically created (default value) if the
    // response is new
    create: {
      assessment_id: assessmentId,
      question_id: questionId,
      value,
    },

    // If the response already exists, update the value and date completed
    update: {
      value,
      date_completed: new Date(),
    },
  });
}

function verifyAllQuestionsAreAnswered(responses: ResponseWithQuestion[]) {
  responses.forEach((response) => {
    if (!response.value) {
      throw new Error("All questions must be answered");
    }
  });
}

function verifyResponsesMatch(
  backendResponses: ResponseWithQuestion[],
  frontendResponses: Map<string, FormDataEntryValue>,
) {
  backendResponses.forEach((response) => {
    const frontendResponse = frontendResponses.get(
      response.question_id.toString(),
    );

    if (frontendResponse !== response.value) {
      throw new Error("Responses do not match");
    }
  });
}
