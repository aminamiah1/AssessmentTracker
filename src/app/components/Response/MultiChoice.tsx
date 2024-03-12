"use client";

import { saveResponse } from "@/app/utils/client/form";
import { BaseResponseProps } from "@/app/types/form";
import { useEffect, useState } from "react";

interface MultiChoiceProps extends BaseResponseProps {
  choices: string[];
}

export function MultiChoice({
  assessmentId,
  choices,
  previousResponse,
  questionId,
}: MultiChoiceProps) {
  const [response, setResponse] = useState(previousResponse);

  useEffect(() => {
    setResponse(previousResponse);
  }, [previousResponse]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResponse(e.target.value);
    await saveResponse(assessmentId, +questionId, e.target.value);
  };

  return (
    <>
      {/* Empty label required for the textarea to appear in the server action's FormData */}
      <label htmlFor={questionId}></label>
      <select
        aria-required
        required
        data-cy="response"
        className="dark:bg-slate-500"
        name={questionId}
        onChange={handleChange}
        value={response}
      >
        {!response && <option>Select an option</option>}
        {choices.map((choice, key) => (
          <option key={key}>{choice}</option>
        ))}
      </select>
    </>
  );
}
