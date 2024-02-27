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
      <select data-cy="response">
        <option value="">Select an option</option>
        {choices.map((choice, key) => (
          <option key={key}>{choice}</option>
        ))}
      </select>
    );
  }

  switch (responseType) {
    case "string":
      return <textarea data-cy="response" />;
    case "boolean":
      return (
        <div data-cy="response">
          <input value="Yes" name={questionId.toString()} type="radio" />
          <label htmlFor="Yes">Yes</label>
          <br />
          <input value="No" name={questionId.toString()} type="radio" />
          <label htmlFor="No">No</label>
        </div>
      );
  }
}
