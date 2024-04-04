interface ProgressBarProps {
  progress: number;
  isOverDue: boolean;
  isComplete: boolean;
  daysRemaining: number;
}

export function ProgressBarPart1({
  progress: progressFraction,
  isOverDue: isOverDue,
  isComplete: isComplete,
  daysRemaining: daysRemaining,
}: ProgressBarProps) {
  const progress = progressFraction * 100;
  return isComplete ? (
    <div
      data-cy="progress-container"
      className="h-2 w-full bg-gray-300 rounded-full shadow-gray-700 shadow-md dark:shadow-black"
    >
      <div
        className={
          "absolute h-6 w-6 rounded-full bg-green-600 top-[3.5rem] right-0 max-[1433px]:invisible"
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
            ? "h-full rounded-full bg-red-600 absoulute"
            : "h-full rounded-full bg-blue-600 absoulute"
        }
      ></div>
      <div
        className={
          isOverDue
            ? ""
            : "absolute h-6 w-6 rounded-full bg-blue-600 top-[3.5rem] max-[1433px]:invisible"
        }
      ></div>
      <div
        className={
          isOverDue
            ? "absolute h-6 w-6 rounded-full bg-red-600 top-[3.5rem] right-0 max-[1433px]:invisible"
            : "absolute h-6 w-6 rounded-full bg-blue-600 top-[3.5rem] right-[2vw] max-[1433px]:invisible"
        }
      ></div>
      <div
        className={
          isOverDue
            ? ""
            : "absolute h-6 w-6 rounded-full  bg-blue-600 top-[3.5rem] left-[8vw] max-[1433px]:invisible"
        }
      ></div>
      <div
        className={
          isOverDue
            ? ""
            : "absolute h-6 w-6 rounded-full  bg-blue-600 top-[3.5rem] right-[11vw] max-[1433px]:invisible"
        }
      ></div>
    </div>
  );
}
