"use client";

import { BaseResponseProps } from "@/app/types/form";
import { ChangeEvent, HTMLProps } from "react";

interface BooleanChoiceProps extends BaseResponseProps<HTMLInputElement> {}

export function BooleanChoice({
  handleSaveResponse,
  questionId,
  response,
  ...props
}: BooleanChoiceProps) {
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) =>
    await handleSaveResponse(e.target.value);

  return (
    <div
      data-cy="response"
      className="flex lg:gap-2 justify-evenly items-center has-[:disabled]:justify-center has-[:disabled]:font-bold"
    >
      <RadioInput
        choice="Yes"
        questionId={questionId}
        checked={response === "Yes"}
        onChange={handleChange}
        {...props}
      />
      <br />
      <RadioInput
        choice="No"
        questionId={questionId}
        checked={response === "No"}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}

interface RadioInput extends HTMLProps<HTMLInputElement> {
  choice: "Yes" | "No";
  questionId: string;
}

function RadioInput({ choice, questionId, ...props }: RadioInput) {
  const id = `${questionId}-${choice.toLowerCase()}`;
  return (
    <div className={`flex gap-2 has-[:disabled]:hidden has-[:checked]:!flex`}>
      <input
        required
        name={questionId}
        id={id}
        className="w-5 disabled:hidden"
        type="radio"
        value={choice}
        {...props}
      />
      <label htmlFor={id}>{choice}</label>
    </div>
  );
}
