import { Response } from "../Response/Response";
import { Question } from "@prisma/client";

interface QuestionProps extends React.HTMLAttributes<HTMLElement> {
  question: Question;
}

export function Question({ question }: QuestionProps) {
  const { choices, id, question_title, response_type } = question;
  return (
    <div
      className={`question p-10 rounded text-center
    dark:bg-slate-800 `}
    >
      <li>
        <p className="pb-6">{question_title}</p>
        <Response
          questionId={id}
          choices={choices}
          responseType={response_type}
        />
      </li>
    </div>
  );
}
