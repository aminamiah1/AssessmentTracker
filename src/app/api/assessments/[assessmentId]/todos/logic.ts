import prisma from "@/app/db";

interface AssessmentTodoOptions {
  onlyCurrentPart?: boolean;
}

const defaultOptions: AssessmentTodoOptions = {
  onlyCurrentPart: true,
};

async function fetchAllTodos(assessmentId: number) {
  const finishedParts = await prisma.partSubmission.findMany({
    where: {
      assessment_id: assessmentId,
    },
    select: {
      part_id: true,
    },
  });

  const parts = await prisma.part.findMany({
    where: {
      id: {
        notIn: finishedParts.map((part) => part.part_id),
      },
    },
    include: {
      Question: {
        include: {
          Response: true,
        },
      },
    },
  });

  return parts;
}

async function fetchCurrentTodo(assessmentId: number) {
  const lastSubmission = await prisma.partSubmission.findFirst({
    where: {
      assessment_id: +assessmentId,
    },
    orderBy: {
      date_submitted: "desc",
    },
  });

  const lastSubmittedPart = await prisma.part.findUnique({
    where: { id: lastSubmission?.part_id ?? -1 },
  });

  let partToRender = (await prisma.part.findUnique({
    where: {
      id: lastSubmittedPart?.next_part_id ?? 1,
    },
    include: {
      Question: {
        include: {
          Response: true,
        },
      },
    },
  }))!;

  return [partToRender];
}

export async function todosForAssessment(
  assessmentId: number,
  options: AssessmentTodoOptions = defaultOptions,
): Promise<PartWithQuestionsAndResponses[]> {
  const { onlyCurrentPart } = options;

  if (onlyCurrentPart) {
    return fetchCurrentTodo(assessmentId);
  } else {
    return fetchAllTodos(assessmentId);
  }
}
