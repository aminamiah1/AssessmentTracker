"use client";

import { BaseResponseProps } from "@/app/types/form";
import { saveResponse } from "@/app/utils/client/form";
import { useEffect, useState } from "react";

interface TextAreaProps extends BaseResponseProps {}

export function TextArea({
  assessmentId,
  previousResponse,
  questionId,
}: TextAreaProps) {
  // Store the state of the current response and the saved response separately/
  // This is to prevent unnecessary API calls when the user hasn't changed their
  // response, and they keep clicking in and out of the text area
  const [savedResponse, setSavedResponse] = useState(previousResponse);
  const [response, setResponse] = useState(previousResponse);

  useEffect(() => {
    setResponse(previousResponse);
  }, [previousResponse]);

  const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);

    // If the response hasn't changed, don't make an API call
    if (e.target.value === savedResponse) return;
    await saveResponse(assessmentId, +questionId, e.target.value);
    setSavedResponse(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setResponse(e.target.value);

  return (
    <>
      {/* Empty label required for the textarea to appear in the server action's FormData */}
      <label htmlFor={questionId}></label>
      <textarea
        aria-required
        required
        data-cy="response"
        className="w-full min-h-32 dark:bg-slate-500"
        name={questionId}
        onBlur={handleBlur}
        onChange={handleChange}
        value={response}
      />
    </>
  );
}
