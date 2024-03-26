import { PartContext, saveResponse } from "@/app/utils/client/form";
import { $Enums } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { BooleanChoice } from "./BooleanChoice";
import { MultiChoice } from "./MultiChoice";
import { TextArea } from "./TextArea";

interface ResponseProps {
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
  previousResponse,
  ...respProps
}: ResponseProps) {
  const [response, setResponse] = useState(previousResponse);

  const { assessmentId, postsave, presave, readonly } = useContext(PartContext);

  useEffect(() => {
    setResponse(previousResponse);
  }, [previousResponse]);

  const handleSaveResponse = async (resp: string = response) => {
    presave?.(resp);

    setResponse(resp);
    await saveResponse(assessmentId, +respProps.questionId, resp);

    postsave?.(resp);
  };

  const props = { ...respProps, handleSaveResponse, response };

  switch (responseType) {
    case "string":
      const isMultichoice = choices.length > 1;

      if (isMultichoice && choices.length === 1) {
        console.warn(
          "Question has only one choice, but is marked as multichoice",
        );
      }

      return isMultichoice ? (
        <MultiChoice disabled={readonly} choices={choices} {...props} />
      ) : (
        <TextArea
          disabled={readonly}
          handleChange={(e) => setResponse(e.target.value)}
          previousResponse={previousResponse}
          {...props}
        />
      );
    case "boolean":
      return <BooleanChoice disabled={readonly} {...props} />;
  }
}
