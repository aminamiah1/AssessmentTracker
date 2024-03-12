"use client";

import { saveResponse } from "@/app/utils/client/form";
import { BaseResponseProps } from "@/app/types/form";
import { ChangeEvent, useEffect, useState } from "react";

interface BooleanChoiceProps extends BaseResponseProps {}

export function BooleanChoice({
  assessmentId,
  previousResponse,
  questionId,
}: BooleanChoiceProps) {
  const [response, setResponse] = useState(previousResponse);

  useEffect(() => {
    setResponse(previousResponse);
  }, [previousResponse]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setResponse(e.target.value);
    await saveResponse(assessmentId, +questionId, e.target.value);
  };

  return (
    <div data-cy="response" className="flex justify-around">
      <div className="flex gap-2">
        <input
          required
          checked={response === "Yes"}
          className="w-5"
          name={questionId}
          onChange={handleChange}
          type="radio"
          value="Yes"
        />
        <label htmlFor="Yes">Yes</label>
      </div>
      <br />
      <div className="flex gap-2">
        <input
          required
          checked={response === "No"}
          className="w-5"
          name={questionId}
          onChange={handleChange}
          type="radio"
          value="No"
        />
        <label htmlFor="No">No</label>
      </div>
    </div>
  );
}
