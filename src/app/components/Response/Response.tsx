import { $Enums } from "@prisma/client";
import { BooleanChoice } from "./BooleanChoice";
import { MultiChoice } from "./MultiChoice";
import { TextArea } from "./TextArea";

interface ResponseProps {
  /** Default value (i.e. if the user has made changes and comes back to the page) */
  previousResponse: string;

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
  previousResponse: defaultValue,
  questionId,
  responseType,
}: ResponseProps) {
  const inputName = questionId.toString();

  if (choices.length > 0) {
    return (
      <MultiChoice
        choices={choices}
        defaultValue={defaultValue}
        inputName={inputName}
      />
    );
  }

  switch (responseType) {
    case "string":
      return <TextArea defaultValue={defaultValue} inputName={inputName} />;
    case "boolean":
      return (
        <BooleanChoice defaultValue={defaultValue} inputName={inputName} />
      );
  }
}
