"use client";

import { BaseResponseProps } from "@/app/types/form";

interface MultiChoiceProps extends BaseResponseProps<HTMLSelectElement> {
  choices: string[];
}

export function MultiChoice({
  choices,
  handleSaveResponse,
  response,
  questionId,
  ...props
}: MultiChoiceProps) {
  return (
    <>
      {/* Empty label required for the textarea to appear in the server action's FormData */}
      <label htmlFor={questionId}></label>
      <select
        aria-required
        required
        data-cy="response"
        className="dark:bg-slate-500 disabled:cursor-not-allowed"
        name={questionId}
        onChange={async (e) => await handleSaveResponse(e.target.value)}
        value={response}
        {...props}
      >
        {!response && <option>Select an option</option>}
        {choices.map((choice, key) => (
          <option key={key}>{choice}</option>
        ))}
      </select>
    </>
  );
}
