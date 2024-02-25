import { IQuestion } from "@/app/types/form";
import { Response } from "../Response/Response";

interface QuestionProps extends React.HTMLAttributes<HTMLElement> {
  question: IQuestion;
}

export function Question({ question }: QuestionProps) {
  const { id, prompt, responseType } = question;
  return (
    <li className="question">
      <p>{prompt}</p>
      <Response questionId={id} responseType={responseType} />
    </li>
  );
}
