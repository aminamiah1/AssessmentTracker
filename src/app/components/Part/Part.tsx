import { Question } from "../Question/Question";

interface PartProps {
  part: PartWithQuestions;
}

export function Part({ part }: PartProps) {
  const { Question: questions } = part;

  return (
    <>
      <h1 style={{ fontSize: 36 }}>{part.part_title}</h1>
      <ol>
        {questions.map((question, key) => (
          <Question key={key} question={question} />
        ))}
      </ol>
    </>
  );
}
