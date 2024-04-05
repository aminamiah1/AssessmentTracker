interface ProgressBarProps {
  progress: number;
  isOverDue: boolean;
  isComplete: boolean;
}

export function ProgressBarPart1({
  progress: progressFraction,
  isOverDue: isOverDue,
  isComplete: isComplete,
}: ProgressBarProps) {
  const progress = progressFraction * 100;
  return isComplete ? (
    <div
      data-cy="progress-container"
      className="h-3 w-full bg-gray-300 rounded-full shadow-gray-700 shadow-md dark:shadow-black"
    >
      <div
        className={
          "absolute h-6 w-6 rounded-full bg-green-600 top-[5em] right-0 max-[1200px]:invisible"
        }
      ></div>
      <div
        data-cy="progress-bar"
        style={{ width: `${progress}%` }}
        className={"h-full rounded-full bg-green-600 absoulute"}
      ></div>
    </div>
  ) : (
    <div
      data-cy="progress-container"
      className="h-3 w-full bg-gray-300 rounded-full shadow-gray-700 shadow-md dark:shadow-black"
    >
      <div
        data-cy="progress-bar"
        style={{ width: `${progress}%` }}
        className={
          isOverDue
            ? "flex h-full rounded-full bg-red-600 absoulute"
            : "flex h-full rounded-full bg-blue-600 absoulute"
        }
      ></div>
      <div
        className={
          isOverDue
            ? "absolute h-6 w-6 rounded-full bg-red-600 top-[2.5em] right-0 max-[1200px]:invisible"
            : "absolute h-6 w-6 rounded-full border border-blue-600 bg-gray-200 top-[5em] right-0 max-[1200px]:invisible"
        }
      ></div>
    </div>
  );
}
