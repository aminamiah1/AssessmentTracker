import { $Enums } from "@prisma/client";

interface ResponseProps {
  /** Used to reference the question for DB storage */
  questionId: number;

  /** Determine the input type to be shown */
  responseType: $Enums.Data_type;

  /** For multi-choice questions */
  choices?: string[];

  /** Keep track of when the response was given */
  logDate?: Date;
}

export function Response({
  choices = [],
  questionId,
  responseType,
}: ResponseProps) {
  if (choices.length > 0) {
    return (
      <select data-cy="response" className="dark:bg-slate-500">
        <option>Select an option</option>
        {choices.map((choice, key) => (
          <option key={key}>{choice}</option>
        ))}
      </select>
    );
  }

  switch (responseType) {
    case "string":
      return (
        <textarea
          data-cy="response"
          className="w-full min-h-32 dark:bg-slate-500"
        />
      );
    case "boolean":
      return (
        <div data-cy="response" className="flex justify-around">
          <div className="flex gap-2">
            <input
              className="w-5"
              value="Yes"
              name={questionId.toString()}
              type="radio"
            />
            <label htmlFor="Yes">Yes</label>
          </div>
          <br />
          <div className="flex gap-2">
            <input
              className="w-5"
              value="No"
              name={questionId.toString()}
              type="radio"
            />
            <label htmlFor="No">No</label>
          </div>
        </div>
      );
  }
}
