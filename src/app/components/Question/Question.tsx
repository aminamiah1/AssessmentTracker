import { Response } from "../Response/Response";

interface QuestionProps extends React.HTMLAttributes<HTMLElement> {
  question: QuestionWithResponse;
}

export function Question({ question }: QuestionProps) {
  const {
    choices,
    id,
    question_title,
    response_type,
    Response: response,
  } = question;

  // We don't NEED the value to exist - this is only
  // to catch the pre-existing response IF it exists
  const prevResponse = response?.length ? response[0].value : "";

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
