import { IQuestion } from "@/app/types/form";
import { Question } from "../Question/Question";
import { Response } from "../Response/Response";

interface PartProps {
  name: string;
}

export function Part({ name }: PartProps) {
  const questions: IQuestion[] = [
    {
      id: 1,
      prompt: "What is your name?",
      responseType: "text",
    },
    {
      id: 2,
      prompt: "Are you a human?",
      responseType: "boolean",
    },
    {
      id: 3,
      prompt: "What is your favorite color?",
      responseType: "multi-choice",
    },
  ];

  return (
    <>
      <h1 style={{ fontSize: 36 }}>{name}</h1>
      <ol type="a">
        {questions.map((question, key) => (
          <Question key={key} prompt={question.prompt}>
            <Response
              questionId={question.id}
              responseType={question.responseType}
            />
          </Question>
        ))}
      </ol>
    </>
  );
}
