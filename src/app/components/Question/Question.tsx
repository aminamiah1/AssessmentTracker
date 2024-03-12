import { Response } from "../Response/Response";

interface QuestionProps extends React.HTMLAttributes<HTMLElement> {
  assessmentId: number;
  question: QuestionWithResponse;
}

export function Question({ assessmentId, question }: QuestionProps) {
  const {
    choices,
    id,
    question_title: questionTitle,
    response_type: responseType,
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
        <p className="pb-6">{questionTitle}</p>
        <Response
          assessmentId={assessmentId}
          previousResponse={prevResponse}
          questionId={id.toString()}
          choices={choices}
          responseType={responseType}
        />
      </li>
    </div>
  );
}
