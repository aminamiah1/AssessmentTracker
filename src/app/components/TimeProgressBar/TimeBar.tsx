interface ProgressBarProps {
  progress: number;
  isOverDue: boolean;
}

export function TimeBar({
  progress: progressFraction,
  isOverDue: isOverDue,
}: ProgressBarProps) {
  const progress = progressFraction * 100;
  return (
    <div
      data-cy="progress-container"
      className="h-2 w-full bg-gray-300 rounded-full shadow-gray-700 shadow-md dark:shadow-black"
    >
      <div
        className={
          isOverDue
            ? "absolute h-6 w-6 rounded-full bg-red-600 top-11 right-0 max-[1365px]:invisible"
            : "absolute h-6 w-6 rounded-full border border-blue-600 bg-gray-200 top-12 right-0 max-[1365px]:invisible"
        }
      ></div>
      <div
        data-cy="progress-bar"
        style={{ width: `${progress}%` }}
        className={
          isOverDue
            ? "h-full rounded-full bg-red-600 absoulute"
            : "h-full rounded-full bg-blue-600 absoulute"
        }
      ></div>
      <div
        className={
          isOverDue
            ? ""
            : "absolute h-6 w-6 rounded-full bg-blue-600 top-12 max-[1365px]:invisible"
        }
      ></div>
    </div>
  );
}
