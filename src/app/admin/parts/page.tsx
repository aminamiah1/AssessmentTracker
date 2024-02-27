import { Part } from "@/app/components/Part/Part";
import { getPartsWithQuestions } from "@/app/utils/form";

export default async function Page() {
  const parts = await getPartsWithQuestions();

  return (
    <div className="max-w-5xl mt-5 ml-8 w-full items-center justify-between font-mono text-sm">
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
}
