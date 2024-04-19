import { format, differenceInDays, addDays } from "date-fns";
import { FiCalendar, FiClock, FiCheck } from "react-icons/fi";
import { ProgressBarPart2 } from "@/app/components/trackingProgress/visualBars/ProgressBarPart2";

interface OverallProgressContentPart2 {
  // Hand in date passed to calculate deadline of hand in date plus 20 days
  handInDate: Date;
  /** The object containing the text and current number of the last completed part for an assessment */
  lastCompletedPart: {
    part_title: string;
    part_number: number;
  };
}

// Logic for the part 2 progress bar for tracking the assessment through the last two stages
export default function AssessmentProgressPart2({
  lastCompletedPart,
  handInDate,
}: OverallProgressContentPart2) {
  // Get the last completed part title and number from object
  const lastCompletedPartTitle = lastCompletedPart.part_title;
  const lastCompletedPartNumber = lastCompletedPart.part_number;

  // Calculate progress for the bar using date-fns
  const postMarkingHandIn = addDays(handInDate, 20);
  const daysRemaining = differenceInDays(postMarkingHandIn, new Date()); // Day difference between now and hand in date plus 20 days for marking

  const isOverdue = daysRemaining < 0; // Check if overdue i.e. minus day difference numbers
  const isComplete =
    lastCompletedPartTitle === "Mark and feedback availability";

  // Calculate progress conditionally
  let progress;
  if (isOverdue || isComplete) {
    progress = 1;
    // If overdue or complete, progress is complete
  } else {
    // If days remaining less than or equal to 100 calculate progress as float
    if (daysRemaining <= 100) {
      progress = Math.min(1, 1 - Math.abs(daysRemaining) / 100);
    } else {
      progress = 0.1; // Else keep as 0.1 to stop the bar "fill in" becoming un-noticable
    }
  }

  // Labels for progress bar conditonally on if overdue
  const timeLabel = isOverdue ? "Overdue" : "Days Left";

  // Only show date progress if tracking not complete
  return (
    <div className="w-full flex justify-evenly rounded p-4 mb-4">
      <div className="w-[60%] relative overflow-hidden text-center">
        {/* Display the visual date progress if not overdue or complete*/}
        <>
          {isOverdue || isComplete ? (
            <h1
              data-cy="dateStatus"
              className="mb-4 text-lg text-gray-700 dark:text-white text-right flex justify-end"
            >
              {isComplete ? (
                <span data-cy="completeText">Completed</span>
              ) : (
                timeLabel
              )}
              {isComplete ? (
                <FiCheck size={30} className="ml-2 flex" />
              ) : (
                <FiClock size={30} className="ml-2 flex" />
              )}
            </h1>
          ) : (
            // Display the two stages as left as text above the progress bar
            <div className="flex w-full mb-2">
              <div className="justify-start w-full">
                <div className="text-md text-gray-700 dark:text-white text-left text-wrap w-2 max-[1200px]:text-sm">
                  <h1>
                    Post <br /> Marking <br /> Moderation
                  </h1>
                </div>
              </div>
              <div className="justify-end w-full">
                <div className="text-md text-gray-700 dark:text-white text-right text-wrap pl-[5em] max-[1200px]:text-sm">
                  <p>
                    Marks And <br /> Feedback <br /> Release
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="w-full group">
            {/* Pass along the progress decimal to visually render the progress bar as well as isComplete and isOverdue variable for 
            conditional rendering */}
            <ProgressBarPart2
              progress={progress}
              isOverDue={isOverdue}
              isComplete={isComplete}
            />
            {/* Hover box showing the last completed part for more detail */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 hidden opacity-0 group-hover:opacity-100 group-hover:block bg-white rounded shadow p-2">
              <h2 className="text-sm">
                Tracking Stage ● {lastCompletedPartNumber}/11
              </h2>
              <h2 className="text-sm mt-2">{lastCompletedPartTitle} </h2>
            </div>
          </div>
          {/* If overdue or complete then don't render the deadline text section */}
          {isOverdue || isComplete ? (
            <div className="flex justify-end">
              <div className="flex flex-col h-5" />
            </div>
          ) : (
            // Show the deadline of the hand in date plus 20 days and the number of days left until then based on the current date
            <div className="flex justify-center mt-8">
              <div className="flex flex-row text-gray-700">
                <div className="flex justify-center">
                  <h1 className="text-right text-md mt-2 dark:text-white flex mr-2">
                    <FiCalendar size={20} className="mr-2" />
                    <span data-cy="handInDeadline">
                      {format(postMarkingHandIn, "dd MMM yyyy")}
                    </span>
                  </h1>
                  <h1
                    className="mt-2 text-md dark:text-white text-center flex"
                    data-cy="trackingStagesComplete"
                  >
                    <FiClock size={20} className="mr-2" />
                    <span data-cy="daysLeftMarking">
                      {daysRemaining} Days Left
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
