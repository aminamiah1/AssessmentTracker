import { ResponseType } from "@/app/types/form";

interface ResponseProps {
  /** Used to reference the question for DB storage */
  questionId: number;

  /** Determine the input type to be shown */
  responseType: ResponseType;

  /** Keep track of when the response was given */
  logDate?: Date;
}

export function Response({ questionId, responseType }: ResponseProps) {
  switch (responseType) {
    case "text":
      return <textarea data-cy="response" />;
    case "boolean":
      return (
        <div style={{ color: "white" }}>
          <input value="Yes" name={questionId.toString()} type="radio" />
          <label htmlFor="Yes">Yes</label>
          <br />
          <input value="No" name={questionId.toString()} type="radio" />
          <label htmlFor="No">No</label>
        </div>
      );
    // multi-choice is left
    default:
      const choices = ["Red", "Green", "Blue"];
      return (
        <select style={{ color: "black" }}>
          {choices.map((choice, key) => (
            <option key={key}>{choice}</option>
          ))}
        </select>
      );
  }
}
