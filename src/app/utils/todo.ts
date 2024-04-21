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
      assigneesRole: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      module: {
        select: {
          module_code: true,
          module_name: true,
        },
      },
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
      assigneesRole: {
        select: {
          role: true,
          user: {
            select: { name: true, email: true, id: true },
          },
        },
      },
      partSubmissions: { orderBy: { date_submitted: "desc" }, take: 1 },
    },
  });
}
