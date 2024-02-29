"use client";

import { BaseResponseProps } from "@/app/types/form";
import { saveResponse } from "@/app/utils/form";
import { useState } from "react";

interface MultiChoiceProps extends BaseResponseProps {
  choices: string[];
}

export function MultiChoice({
  choices,
  defaultValue,
  inputName,
}: MultiChoiceProps) {
  const [response, setResponse] = useState(defaultValue);

  return (
    <>
      {/* Empty label required for the textarea to appear in the server action's FormData */}
      <label htmlFor={inputName}></label>
      <select
        data-cy="response"
        className="dark:bg-slate-500"
        name={inputName}
        onChange={async (e) => {
          setResponse(e.target.value);
          saveResponse(1, +inputName, e.target.value).then(() => {
            alert("Saved!");
          });
        }}
        value={response}
      >
        <option>Select an option</option>
        {choices.map((choice, key) => (
          <option key={key}>{choice}</option>
        ))}
      </select>
    </>
  );
}
