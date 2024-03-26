import { createContext } from "react";

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

interface PartContext {
  assessmentId: number;
  readonly: boolean;
  presave: (response: string) => void;
  postsave: (response: string) => void;
}

export const PartContext = createContext<PartContext>(null!);
