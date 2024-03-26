"use client";

import { BaseResponseProps } from "@/app/types/form";
import { ChangeEvent } from "react";

interface TextAreaProps extends BaseResponseProps<HTMLTextAreaElement> {
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  previousResponse: string;
}

export function TextArea({
  handleChange,
  handleSaveResponse,
  previousResponse,
  questionId,
  response,
  ...props
}: TextAreaProps) {
  const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // To not allow blank responses (like spaces, new lines etc.)
    const newResponse = e.target.value.trim();

    // If the response hasn't changed, don't make an API call
    if (newResponse === previousResponse) return;
    await handleSaveResponse(newResponse);
  };

  return (
    <div className="flex">
      {/* Empty label required for the textarea to appear in the server action's FormData */}
      <label htmlFor={questionId}></label>
      <textarea
        aria-required
        required
        data-cy="response"
        className="m-5 p-2 max-w-full w-dvw min-h-32 disabled:cursor-not-allowed dark:bg-slate-500 rounded-lg"
        name={questionId}
        onBlur={async (e) => await handleBlur(e)}
        onChange={handleChange}
        value={response}
        {...props}
      />
    </div>
  );
}
