interface ProgressBarProps {
  progress: number;
  isOverDue: boolean;
  isComplete: boolean;
}

// CSS for progress bar part 2 with conditional rendering for the visuals of the two sections with end circle
// or the completed bar or the overdue bar
export function ProgressBarPart2({
  progress: progressFraction,
  isOverDue: isOverDue,
  isComplete: isComplete,
}: ProgressBarProps) {
  const progress = progressFraction * 100;
  const progressContainerStyles =
    "h-3 w-full bg-gray-300 rounded-full shadow-gray-700 shadow-md dark:shadow-black";
  // If the tracking process is complete return the green completed bar
  return isComplete ? (
    <div data-cy="progress-container" className={progressContainerStyles}>
      <div
        className={
          "absolute h-6 w-6 rounded-full bg-green-600 top-[2.2em] right-0 max-[1200px]:invisible"
        }
      ></div>
      <div
        data-cy="progress-bar"
        style={{ width: `${progress}%` }}
        className={"h-full rounded-full bg-green-600 absoulute"}
      ></div>
    </div>
  ) : (
    // Else render the in progress tracking bar for part 2 showing a bar conditionally filled by days left progress compared
    // to hand in date plus 20 days, if overdue just render a red bar
    <div data-cy="progress-container" className={progressContainerStyles}>
      <div
        data-cy="progress-bar"
        style={{ width: `${progress}%` }}
        className={`flex h-full rounded-full ${isOverDue ? "bg-red-600" : "bg-blue-600"}`}
      ></div>
      <div
        className={`absolute h-6 w-6 rounded-full max-[1200px]:invisible right-0 ${isOverDue ? "bg-red-600 top-[2.5em]" : "border border-blue-600 bg-gray-200 top-[4.6em]"}`}
      ></div>
    </div>
  );
}
