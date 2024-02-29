import { Question } from "../Question/Question";

interface PartProps {
  part: PartWithQuestions;
}

export function Part({ part }: PartProps) {
  const { Question: questions } = part;

  async function handleSubmit(form: FormData) {
    "use server";

    form.forEach((value, questionId) => console.log(questionId, value));
  }

  return (
    <form action={handleSubmit}>
      <h1 className="pt-10 pb-2 text-3xl">{part.part_title}</h1>
      <ol className="flex max-w-prose gap-16 flex-col">
        {questions.map((question, key) => (
          <Question key={key} question={question} />
        ))}
      </ol>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
}
