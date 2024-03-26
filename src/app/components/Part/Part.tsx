"use client";

import { usePartTodo } from "@/app/hooks/useAssessments";
import { submitPart } from "@/app/utils/client/assessment";
import { PartContext } from "@/app/utils/client/form";
import { Question as IQuestion } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Question } from "../Question/Question";

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
  const [isLoading, setIsLoading] = useState(false);

  const { Question: questions } = part;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  const presave = (response: string) => {
    setIsLoading(true);
  };
  const postsave = (response: string) => {
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col items-center"
    >
      <h1 id={`${part.id}`} className="mb-10 mt-4 pb-2 text-3xl">
        {part.part_title}
      </h1>
      <ol className="flex peer max-w-prose gap-16 flex-col">
        <PartContext.Provider
          value={{ assessmentId, readonly, presave, postsave }}
        >
          {questions.map((question, key) => (
            <Question key={key} question={question as QuestionWithResponse} />
          ))}
        </PartContext.Provider>
      </ol>
      {!readonly && (
        <button
          className="disabled:cursor-not-allowed w-fit disabled:bg-blue-300 mb-12 mt-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg"
          disabled={isLoading}
          type="submit"
        >
          Submit
        </button>
      )}
    </form>
  );
}

export function PartTodoByFetch({ assessmentId }: PartTodoByFetchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession({ required: true });
  const { partTodo, isLoading, error } = usePartTodo(assessmentId);

  useEffect(() => {
    if (!session) return;

    // We don't want to interrupt a user's navigation if they're already
    // navigating to a specific part
    if (!partTodo || window.location.hash) return;

    // Navigate the user to the outstanding part if they have the correct role
    if (session.user.roles.includes(partTodo[0].role))
      router.replace(`${pathname}#${partTodo[0].id}`);
  }, [partTodo, session]);

  if (isLoading || !session) return <div>Loading...</div>;
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
