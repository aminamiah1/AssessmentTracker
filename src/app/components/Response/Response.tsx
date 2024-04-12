import { PartContext, saveResponse } from "@/app/utils/client/form";
import { $Enums } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    try {
      presave?.(resp);

      setResponse(resp);
      const res = await saveResponse(assessmentId, +respProps.questionId, resp);
      const json = await res.json();

      if (!res.ok) {
        throw new Error("Error whilst submitting response: " + json.message);
      }

      postsave?.(resp);
    } catch (e) {
      // We don't want to call the postsave callback if the save
      // fails - the user hasn't actually saved anything
      toast.error((e as Error).message);
    }
  };

  const props = { ...respProps, handleSaveResponse, response };

  let ResponseComponent: JSX.Element;
  switch (responseType) {
    case "string":
      const isMultichoice = choices.length > 1;

      if (isMultichoice && choices.length === 1) {
        console.warn(
          "Question has only one choice, but is marked as multichoice",
        );
      }

      ResponseComponent = isMultichoice ? (
        <MultiChoice disabled={readonly} choices={choices} {...props} />
      ) : (
        <TextArea
          disabled={readonly}
          handleChange={(e) => setResponse(e.target.value)}
          previousResponse={previousResponse}
          {...props}
        />
      );
      break;
    case "boolean":
      ResponseComponent = <BooleanChoice disabled={readonly} {...props} />;
      break;
  }

  return (
    <>
      {ResponseComponent}
      <ToastContainer />
    </>
  );
}
