import { ProgressBarPart1 } from "@/app/components/trackingProgress/visualBars/ProgressBarPart1";
import { format, differenceInDays } from "date-fns";
import { FiCalendar, FiClock } from "react-icons/fi";

interface OverallProgressContentPart1 {
  /** The array containing the text and current number of the last completed part for an assessment */
  lastCompletedPart: {
    part_title: string;
    part_number: number;
  }; // Last completed part title and number needed to render overall progress visual for assessment
}

// Logic for the part 1 progress bar for tracking the assessment through the first four tracking stages
export default function AssessmentProgressPart1({
  lastCompletedPart,
}: OverallProgressContentPart1) {
  // Get the last completed part title and number from props
  const lastCompletedPartTitle = lastCompletedPart.part_title;
  const lastCompletedPartNumber = lastCompletedPart.part_number;
  const progress = lastCompletedPartNumber / 10; // Divide last part number by the maximum number of parts (10) for first tracking stage to get progress decimal

  // Calculate the width of the completed portion of the progress bar for mobile view
  const progressBarWidth = 100;
  const completedWidth = progress * progressBarWidth; //Calculate where to place last completed part text in mobile view

  // Caluclate time from now till the next july the 1st
  const nextJuly = new Date(
    new Date().getFullYear() + (new Date().getMonth() >= 6 ? 1 : 0),
    6,
    1,
  );
  const daysRemaining = differenceInDays(nextJuly, new Date()); // Day difference between now and next july when the first 10 stages are to be completed

  const isOverdue = daysRemaining < 0; // Check if overdue i.e. in minus day difference numbers
  const isComplete =
    lastCompletedPart.part_title === "Internal moderation of marked sample" ||
    lastCompletedPart.part_title === "Mark and feedback availability";
  // Check if complete for this part by comparing part title to the two stages after final section 4 stage

  return (
    <div className="w-full flex justify-evenly rounded p-4">
      <div className="w-[60%] relative overflow-hidden text-left">
        {/* Only render if the assessment has a associated last completed part*/}
        {lastCompletedPart && (
          <>
            <div className="flex justify-between">
              {/* Show the four sections to complete above the progress bar*/}
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white max-[1200px]:text-sm  max-[944px]:invisible">
                  <h1 data-cy="trackingStagesComplete">Internal Peer</h1>
                  <h1>Moderation</h1>
                  <h1>Feedback</h1>
                </div>
              </div>
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white max-[1200px]:text-sm max-[944px]:invisible">
                  <h1 data-cy="trackingStagesComplete">Moderation</h1>
                  <h1>Panel</h1>
                  <h1>Comments</h1>
                </div>
              </div>
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white max-[1200px]:text-sm max-[944px]:invisible">
                  <h1 data-cy="trackingStagesComplete">External</h1>
                  <h1>Examiner</h1>
                  <h1>Feedback</h1>
                </div>
              </div>
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white text-left max-[1200px]:text-sm max-[944px]:invisible">
                  <h1 data-cy="trackingStagesComplete">Post</h1>
                  <h1>Marking</h1>
                  <h1>Moderation</h1>
                </div>
              </div>
            </div>
            {/* Display the tracking form stages progress as visual bar*/}
            <div className="w-full group">
              {/* Pass along the progress decimal to visually render the progress bar as well as isComplete and isOverdue variable for 
              conditional rendering */}
              <ProgressBarPart1
                progress={progress}
                isComplete={isComplete}
                isOverDue={isOverdue}
              />
              {/* In mobile view only render last part beneath the progress bar to fit the restricted screen size */}
              <div
                className="mt-2 text-md text-gray-700 dark:text-white min-[944px]:invisible"
                style={{ width: `${completedWidth}%`, textAlign: "right" }}
              >
                <span
                  data-cy="lastCompletedPart"
                  className="min-[944px]:text-[0.1rem]"
                >
                  {lastCompletedPartTitle}
                </span>
              </div>
              {/* Hover box showing the last completed part for more detail */}
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 hidden opacity-0 group-hover:opacity-100 group-hover:block bg-white rounded shadow p-2">
                <h2 className="text-sm" data-cy="currentTrackingStage">
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
              // Show the deadline of the 1st of july and the number of days left until then based on the current date
              <div className="flex justify-center">
                <div className="flex flex-row text-gray-700">
                  <div className="flex justify-center">
                    <h1 className="text-right text-md mt-2 dark:text-white flex mr-2">
                      <FiCalendar size={20} className="mr-2" />
                      <span data-cy="deadline">
                        {format(nextJuly, "dd MMM yyyy")}
                      </span>
                    </h1>
                    <h1
                      className="mt-2 text-md dark:text-white text-center flex"
                      data-cy="trackingStagesComplete"
                    >
                      <FiClock size={20} className="mr-2" />
                      <span data-cy="daysLeft">{daysRemaining} Days Left</span>
                    </h1>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
