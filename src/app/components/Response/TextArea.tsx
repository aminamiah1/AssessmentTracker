import { BaseResponseProps } from "@/app/types/form";

interface TextAreaProps extends BaseResponseProps {}

export function TextArea({ inputName }: TextAreaProps) {
  return (
    <>
      {/* Empty label required for the textarea to appear in the server action's FormData */}
      <label htmlFor={inputName}></label>
      <textarea
        data-cy="response"
        className="w-full min-h-32 dark:bg-slate-500"
        name={inputName}
      />
    </>
  );
}
