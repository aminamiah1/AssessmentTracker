"use client";

import { BaseResponseProps } from "@/app/types/form";
import { saveResponse } from "@/app/utils/form";
import { ChangeEvent, useState } from "react";

interface BooleanChoiceProps extends BaseResponseProps {}

export function BooleanChoice({ defaultValue, inputName }: BooleanChoiceProps) {
  const [response, setResponse] = useState(defaultValue);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setResponse(e.target.value);
    saveResponse(1, +inputName, e.target.value).then(() => {
      alert("Saved!");
    });
  };

  return (
    <div data-cy="response" className="flex justify-around">
      <div className="flex gap-2">
        <input
          checked={response === "Yes"}
          className="w-5"
          name={inputName}
          onChange={handleChange}
          type="radio"
          value="Yes"
        />
        <label htmlFor="Yes">Yes</label>
      </div>
      <br />
      <div className="flex gap-2">
        <input
          checked={response === "No"}
          className="w-5"
          name={inputName}
          onChange={handleChange}
          type="radio"
          value="No"
        />
        <label htmlFor="No">No</label>
      </div>
    </div>
  );
}
