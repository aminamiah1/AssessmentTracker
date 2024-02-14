interface QuestionProps extends React.HTMLAttributes<HTMLElement> {
  prompt: string;
}

export function Question({ prompt, children }: QuestionProps) {
  return (
    <li className="question">
      <p>{prompt}</p>
      {children}
    </li>
  );
}
