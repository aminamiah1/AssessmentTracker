import { Part } from "@/app/components/Part/Part";
import { getPartsWithQuestions } from "@/app/utils/form";

export default async function Page() {
  const parts = await getPartsWithQuestions();

  return (
    <div className="flex flex-col items-center">
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
}
