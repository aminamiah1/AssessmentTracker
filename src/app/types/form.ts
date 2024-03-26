import { HTMLProps } from "react";

export interface BaseResponseProps<T> extends HTMLProps<T> {
  handleSaveResponse: (response?: string) => Promise<void>;
  response: string;

  /** Used to reference the question for DB storage */
  questionId: string;
}
