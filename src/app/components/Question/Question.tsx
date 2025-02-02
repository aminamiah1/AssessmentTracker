import { PartContext } from "@/app/utils/client/form";
import { useContext } from "react";
import { Response } from "../Response/Response";

interface QuestionProps extends React.HTMLAttributes<HTMLElement> {
  question: QuestionWithResponse;
}

export function Question({ question }: QuestionProps) {
  const { assessmentId } = useContext(PartContext);

  const {
    choices,
    id,
    question_title: questionTitle,
    response_type: responseType,
    Response: responses = [],
  } = question;

  // We don't NEED the value to exist - this is only
  // to catch the pre-existing response IF it exists
  let previousResponse: string = "";
  if (responses.length > 0) {
    const foundResponse = responses.find(
      (r) => r.assessment_id === assessmentId,
    );

    if (foundResponse) {
      previousResponse = foundResponse.value;
    }
  }

  return (
    <div
      id={`question-${id}`}
      className={`question w-full lg:grid lg:grid-cols-3 gap-4 px-8 py-3 rounded-lg text-center
    dark:bg-slate-700 bg-gray-100 shadow-md dark:shadow-2xl`}
    >
      <li
        className={`w-full ${responseType === "boolean" ? "lg:col-span-2" : choices.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}
      >
        <p className="pb-4 lg:p-0">{questionTitle}</p>
      </li>
      <Response
        previousResponse={previousResponse}
        questionId={id.toString()}
        choices={choices}
        responseType={responseType}
      />
    </div>
  );
}
