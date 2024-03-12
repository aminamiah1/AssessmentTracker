export function submitPart(
  assessmentId: number,
  partId: number,
  responses: { [key: string]: FormDataEntryValue },
): Promise<Response> {
  return fetch(`/api/assessments/${assessmentId}/submissions`, {
    method: "POST",
    body: JSON.stringify({ partId, responses }),
  });
}
