import { Question } from "../Question/Question";

interface PartProps {
  part: PartWithQuestions;
}

export function Part({ part }: PartProps) {
  const { Question: questions } = part;

  return (
    <>
      <h1 className="pt-10 pb-2 text-3xl">{part.part_title}</h1>
      <ol className="flex max-w-prose gap-16 flex-col">
        {questions.map((question, key) => (
          <Question key={key} question={question} />
        ))}
      </ol>
    </>
  );
}
