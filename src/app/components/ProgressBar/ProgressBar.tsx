interface ProgressBarProps {
  progress: number;
}

// Maybe think about moving the progress text to this component and having it
// populate dynamically based off the progress?
// Something like:
//
// interface ProgressBarProps {
//  progress: number;
//  displayText?: boolean; // true by default
//  text?: string; // "{{PERCENT}} complete" by default - use templating to allow for custom text
// }

export function ProgressBar({ progress: progressFraction }: ProgressBarProps) {
  const progress = progressFraction * 100;
  return (
    <div
      data-cy="progress-container"
      className="h-5 w-full bg-gray-300 rounded"
    >
      <div
        data-cy="progress-bar"
        style={{ width: `${progress}%` }}
        className={`h-full ${progress < 80 ? (progress < 40 ? "bg-red-600" : "bg-orange-600") : "bg-green-600"}`}
      ></div>
    </div>
  );
}
