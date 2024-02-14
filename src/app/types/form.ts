export type ResponseType = "text" | "boolean" | "multi-choice";

export interface IQuestion {
  id: number;
  prompt: string;
  responseType: ResponseType;
}

export interface IPart {
  id: number;
  questions: IQuestion[];
}

export interface IResponse {
  questionId: number;
  value: string | boolean;
}
