import prisma from "../db";

export async function getAssessmentsWithPartSubmissionsForUser(
  userId: number,
): Promise<AssessmentWithPartSubmission[]> {
  return await prisma.assessment.findMany({
    where: {
      assigneesRole: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      partSubmissions: { orderBy: { date_submitted: "desc" }, take: 1 },
    },
  });
}

export async function getAssessmentWithPartSubmission(assessmentId: number) {
  return await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    include: {
      assignees: true,
      partSubmissions: { orderBy: { date_submitted: "desc" }, take: 1 },
    },
  });
}
