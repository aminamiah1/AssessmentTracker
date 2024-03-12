import prisma from "@/app/db";
import { getAssessmentsWithPartSubmissionsForUser } from "@/app/utils/todo";
import { $Enums } from "@prisma/client";

export async function assessmentHasAssignee(
  assessmentId: number,
  userId: number,
) {
  const assignee = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      assignees: {
        some: {
          id: userId,
        },
      },
    },
  });

  return !!assignee;
}

export async function todosForUser(userId: number, roles: $Enums.Role[]) {
  // The idea is to get all assessments the user is assigned to,
  // check whether those assessments have any parts submitted:
  // - If parts are submitted, check the most recent submission,
  //    and retrieve the `next_part_id`
  // - If no parts are submitted, retrieve the first part_id
  const assignedAssessments =
    await getAssessmentsWithPartSubmissionsForUser(userId);

  const submittedPartIds = assignedAssessments.map((assessment) => {
    const { partSubmissions } = assessment;

    return partSubmissions.length ? partSubmissions[0].part_id : 0;
  });

  const parts = await prisma.part.findMany({
    where: {
      OR: [
        {
          previous_part: {
            some: {
              id: {
                in: submittedPartIds,
              },
            },
          },
        },

        // If no parts have been submitted for an assessment, we want to
        // return the first part
        submittedPartIds.includes(0)
          ? {
              id: 1,
            }
          : {},
      ],
      role: {
        in: roles,
      },
    },
    include: {
      Question: {
        include: {
          Response: true,
        },
      },
      previous_part: true,
    },
  });

  if (parts.length === 0) return [];

  const partsToBeReturned = assignedAssessments.map((assessment) => {
    let part: PartWithQuestionsAndResponses;

    const assessmentHasSubmissions = assessment.partSubmissions.length > 0;

    if (assessmentHasSubmissions) {
      // We want the most recent submission - this should be the ONLY
      // element of the list because of the `take: 1` in the getAssessmentsForUser
      // query
      const { part_id } = assessment.partSubmissions[0];

      part = parts.find((part) => part.previous_part[0].id === part_id)!;
    } else {
      // If the assessment doesn't yet have a part submission, it's safe
      // to assume that the first part needs to be completed
      part = parts.find((part) => part.id === 1)!;
    }

    return { assessment, part };
  });

  return partsToBeReturned;
}
