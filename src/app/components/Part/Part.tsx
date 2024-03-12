"use client";

import { submitPart } from "@/app/utils/client/assessment";
import { Question as IQuestion } from "@prisma/client";
import { FormEvent } from "react";
import { Question } from "../Question/Question";
import { usePartTodo } from "@/app/hooks/useAssessments";

interface PartTodoByFetchProps {
  assessmentId: number;
  /** This is pretty much only here for the component test, but might
   * come in handy in the future if we want to do other things after the
   * form is submitted (i.e. notifications, emails, whatever)
   */
  afterSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  readonly?: boolean;
}

interface PartProps extends PartTodoByFetchProps {
  part: PartWithQuestionsAndResponses;
}

export function Part({
  assessmentId,
  part,
  afterSubmit,
  readonly = false,
}: PartProps) {
  const { Question: questions } = part;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries());

    try {
      verifyResponses(formEntries, questions);

      const res = await submitPart(assessmentId, part.id, formEntries);

      if (res.status === 200) {
        if (afterSubmit) afterSubmit(e);
        // Spent too long trying to fix this... Cypress doesn't like working
        // with the new `next/navigation` package, so we'll just redirect
        // with vanilla JS for now... :(  (TODO)
        else window.location.href = "/todo";
      } else alert("Failed to submit part");
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col justify-center"
    >
      <h1 className="pt-10 pb-2 text-3xl">{part.part_title}</h1>
      <ol className="flex max-w-prose gap-16 flex-col">
        {questions.map((question, key) => (
          <Question
            assessmentId={assessmentId}
            key={key}
            question={question as QuestionWithResponse}
          />
        ))}
      </ol>
      {!readonly && (
        <button
          type="submit"
          className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      )}
    </form>
  );
}

export function PartTodoByFetch({ assessmentId }: PartTodoByFetchProps) {
  const { partTodo, isLoading, error } = usePartTodo(assessmentId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Part assessmentId={assessmentId} part={partTodo[0]} />
    </>
  );
}

function verifyResponses(
  formEntries: { [k: string]: FormDataEntryValue },
  questions: IQuestion[],
) {
  questions.forEach((question) => {
    const response = formEntries[question.id];

    const isValidMultichoiceQuestion =
      question.choices.length > 1 && question.response_type === "string";

    if (isValidMultichoiceQuestion) {
      const isValidChoice = question.choices.includes(response.toString());

      if (!isValidChoice) {
        throw new Error(`Invalid choice for question ${question.id}`);
      }
    }

    if (question.response_type === "boolean") {
      if (response !== "Yes" && response !== "No") {
        throw new Error(`Invalid response for question ${question.id}`);
      }
    }

    if (response.toString().trim() === "")
      throw new Error(`Empty response for question ${question.id}`);
  });
}
