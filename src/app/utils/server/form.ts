import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("No session found when saving response");

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

  // revalidatePath("/", "layout");
  revalidatePath("/todo/[assessmentId]", "page");
}
