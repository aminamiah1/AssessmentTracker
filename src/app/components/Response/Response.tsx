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
  const inputName = questionId.toString();

  if (choices.length > 0) {
    return (
      <>
        {/* Empty label required for the textarea to appear in the server action's FormData */}
        <label htmlFor={inputName}></label>
        <select
          data-cy="response"
          className="dark:bg-slate-500"
          name={inputName}
        >
          <option>Select an option</option>
          {choices.map((choice, key) => (
            <option key={key}>{choice}</option>
          ))}
        </select>
      </>
    );
  }

  switch (responseType) {
    case "string":
      return (
        <>
          {/* Empty label required for the textarea to appear in the server action's FormData */}
          <label htmlFor={inputName}></label>
          <textarea
            data-cy="response"
            className="w-full min-h-32 dark:bg-slate-500"
            name={inputName}
          />
        </>
      );
    case "boolean":
      return (
        <div data-cy="response" className="flex justify-around">
          <div className="flex gap-2">
            <input className="w-5" value="Yes" name={inputName} type="radio" />
            <label htmlFor="Yes">Yes</label>
          </div>
          <br />
          <div className="flex gap-2">
            <input className="w-5" value="No" name={inputName} type="radio" />
            <label htmlFor="No">No</label>
          </div>
        </div>
      );
  }
}
