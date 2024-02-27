import { Response } from "../Response/Response";
import { Question } from "@prisma/client";

interface QuestionProps extends React.HTMLAttributes<HTMLElement> {
  question: Question;
}

export function Question({ question }: QuestionProps) {
  const { choices, id, question_title, response_type } = question;
  return (
    <li className="question">
      <p>{question_title}</p>
      <Response
        questionId={id}
        choices={choices}
        responseType={response_type}
      />
    </li>
  );
}
