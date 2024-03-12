export function saveResponse(
  assessmentId: number,
  questionId: number,
  response: string,
): Promise<Response> {
  return fetch(`/api/assessments/${assessmentId}/responses/${questionId}`, {
    method: "PUT",
    body: JSON.stringify({ newValue: response }),
  });
}
