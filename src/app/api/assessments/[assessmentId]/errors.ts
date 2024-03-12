import { assessmentHasAssignee } from "@/app/utils/server/assessment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

/**
 * A function to handle authentication for the assessment responses;
 * - If the user is not logged in, they are not authorized for the endpoint
 * - If the user is not a PS Team member and not the assignee, they are not
 *   authorized for the endpoint
 * @param assessmentId
 * @returns If the user is not authorized, a 401 response is returned
 */
async function handleAuth(assessmentId: number) {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session;

  let isPSTeamMember = false;
  let isAssignee = false;

  if (isLoggedIn) {
    isPSTeamMember = session.user.roles.includes("ps_team");
    isAssignee = await assessmentHasAssignee(assessmentId, +session.user.id);
  }

  let message: string = "";
  switch (true) {
    case !isLoggedIn:
      message = "Must be logged in";
      break;
    // TODO: Do we want PS Team members to be able to edit
    // other peoples' responses?
    case !isPSTeamMember && !isAssignee:
      message = "Unauthorized";
      break;
    default:
      break;
  }

  if (message) {
    return new NextResponse(JSON.stringify({ message }), { status: 401 });
  }
}

/**
 * A general-purpose error handler for all `assessments/[assessmentId]` endpoints
 * @param assessmentId
 * @returns
 */
export async function handleErrors(assessmentId: string) {
  let message: string = "";
  switch (true) {
    case !assessmentId:
      message = "No 'assessmentId' query parameter provided";
      break;
    case assessmentId && isNaN(+assessmentId):
      message = "Invalid 'assessmentId' format";
      break;
    default:
      break;
  }

  if (message) {
    return new NextResponse(JSON.stringify({ message }), { status: 400 });
  }

  const authError = await handleAuth(+assessmentId);
  if (authError) return authError;
}
