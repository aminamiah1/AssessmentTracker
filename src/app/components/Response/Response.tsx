import { $Enums } from "@prisma/client";
import { BooleanChoice } from "./BooleanChoice";
import { MultiChoice } from "./MultiChoice";
import { TextArea } from "./TextArea";

interface ResponseProps {
  /** The assessment ID to which this response is relating to */
  assessmentId: number;

  /** Default value (i.e. if the user has made changes and comes back to the page) */
  previousResponse: string;

  /** Used to reference the question for DB storage */
  questionId: string;

  /** Determine the input type to be shown */
  responseType: $Enums.Data_type;

  /** For multi-choice questions */
  choices?: string[];
}

export function Response({
  choices = [],
  responseType,
  ...props
}: ResponseProps) {
  switch (responseType) {
    case "string":
      const isMultichoice = choices.length > 1;

      if (isMultichoice && choices.length === 1) {
        console.warn(
          "Question has only one choice, but is marked as multichoice",
        );
      }

      return isMultichoice ? (
        <MultiChoice choices={choices} {...props} />
      ) : (
        <TextArea {...props} />
      );
    case "boolean":
      return <BooleanChoice {...props} />;
  }
}
