interface ProgressBarProps {
  progress: number;
}

export function TimeBar({ progress: progressFraction }: ProgressBarProps) {
  const progress = progressFraction * 100;
  return (
    <div
      data-cy="progress-container"
      className="h-5 w-full bg-gray-300 rounded-full shadow-gray-700 shadow-md dark:shadow-black"
    >
      <div
        data-cy="progress-bar"
        style={{ width: `${progress}%` }}
        className={`h-full rounded-full ${progress < 80 ? (progress < 40 ? "bg-green-600" : "bg-orange-600") : "bg-red-600"}`}
      ></div>
    </div>
  );
}
