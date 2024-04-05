import { ProgressBarPart1 } from "@/app/components/module-leader/ProgressBarPart1";
import { ProgressBarPart2 } from "@/app/components/module-leader/ProgressBarPart2";
import { format, differenceInDays, addDays } from "date-fns"; // Import necessary functions
import { FiCalendar, FiClock, FiCheck } from "react-icons/fi";
interface OverallProgressContentPart1 {
  /** The array containing the text and current number of the last completed part for an assessment */
  lastCompletedPart: {
    part_title: string;
    part_number: number;
  }; // Last completed part title and number needed to render overall progress visual for assessment
}

interface OverallProgressContentPart2 {
  handInDate: Date;
  /** The array containing the text and current number of the last completed part for an assessment */
  lastCompletedPart: {
    part_title: string;
    part_number: number;
  }; // Last completed part title and number needed to render overall progress visual for assessment
}

function AssessmentProgressPart1({
  lastCompletedPart,
}: OverallProgressContentPart1) {
  // Get the last completed part title and number from object
  const lastCompletedPartTitle = lastCompletedPart.part_title;
  const lastCompletedPartNumber = lastCompletedPart.part_number;
  const progress = lastCompletedPartNumber / 10; // Divide last part number by the maximum number of parts (10) for first tracking stage to get progress decimal

  // Caluclate time from now till the next july the 1st
  const nextJuly = new Date(
    new Date().getFullYear() + (new Date().getMonth() >= 6 ? 1 : 0),
    6,
    1,
  );
  const daysRemaining = differenceInDays(nextJuly, new Date()); // Day difference between now and hand in date
  const isOverdue = daysRemaining < 0; // Check if overdue i.e. minus day difference numbers
  const isComplete =
    lastCompletedPart.part_title === "Internal moderation of marked sample" ||
    lastCompletedPart.part_title === "Mark and feedback availability";
  // Check if complete by comparing part title to the two stages after final section 4 stage

  return (
    <div className="w-full flex justify-evenly rounded p-4">
      <div className="w-[60%] relative overflow-hidden text-left">
        {lastCompletedPart && (
          <>
            <div className="flex justify-between">
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white">
                  <h1 data-cy="trackingStagesComplete">Internal Peer</h1>
                  <h1>Moderation</h1>
                  <h1>Feedback</h1>
                </div>
              </div>
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white">
                  <h1 data-cy="trackingStagesComplete">Moderation</h1>
                  <h1>Panel</h1>
                  <h1>Comments</h1>
                </div>
              </div>
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white">
                  <h1 data-cy="trackingStagesComplete">External</h1>
                  <h1>Examiner</h1>
                  <h1>Feedback</h1>
                </div>
              </div>
              <div>
                <div className="mb-4 text-md text-gray-700 dark:text-white text-left">
                  <h1 data-cy="trackingStagesComplete">Post</h1>
                  <h1>Marking</h1>
                  <h1>Moderation</h1>
                </div>
              </div>
            </div>
            {/* Display the tracking form stages progress as visual bar*/}
            <div className="w-full group">
              <ProgressBarPart1
                progress={progress}
                isComplete={isComplete}
                isOverDue={isOverdue}
              />
              {/* Hover Box */}
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 hidden opacity-0 group-hover:opacity-100 group-hover:block bg-white rounded shadow p-2">
                <h2 className="text-sm">
                  Tracking Stage ● {lastCompletedPartNumber}/11
                </h2>
                <h2 className="text-sm mt-2">{lastCompletedPartTitle} </h2>
              </div>
            </div>
            {isOverdue || isComplete ? (
              <div className="flex justify-end">
                <div className="flex flex-col h-5" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-row text-gray-700">
                  <div className="flex justify-center">
                    <h1 className="text-right text-md mt-2 dark:text-white flex mr-2">
                      <FiCalendar size={20} className="mr-2" />
                      {format(nextJuly, "dd MMM yy")}
                    </h1>
                    <h1
                      className="mt-2 text-md dark:text-white text-center flex"
                      data-cy="trackingStagesComplete"
                    >
                      <FiClock size={20} className="mr-2" />
                      {daysRemaining} Days Left
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

function AssessmentProgressPart2({
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
    lastCompletedPart.part_title === "Mark and feedback availability";

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
      progress = 0.1; // Else keep as 0.1
    }
    // Calculate progress bar point based on days remaining in float format
  }

  // Labels for progress bar
  const timeLabel = isOverdue ? "Overdue" : "Days Left";

  // Only show date progress if tracking not complete
  return (
    <div className="w-full flex justify-evenly rounded p-4 mb-4">
      <div className="w-[60%] relative overflow-hidden text-center">
        {/* Display the visual date progress*/}
        <>
          {isOverdue || isComplete ? (
            <h1
              data-cy="dateStatus"
              className="mb-4 text-lg text-gray-700 dark:text-white text-right flex justify-end"
            >
              {isComplete ? "Completed" : timeLabel}
              {isComplete ? (
                <FiCheck size={30} className="ml-2 flex" />
              ) : (
                <FiClock size={30} className="ml-2 flex" />
              )}
            </h1>
          ) : (
            <div className="flex w-full mb-2">
              <div className="justify-start w-full">
                <div className="text-md text-gray-700 dark:text-white text-left text-wrap w-2">
                  <h1>Post</h1>
                  <h1>Marking</h1>
                  <h1>Moderation</h1>
                </div>
              </div>
              <div className="justify-end w-full">
                <div className="text-md text-gray-700 dark:text-white text-right text-wrap pl-[5em]">
                  <p>Marks And</p>
                  <p>Feedback</p>
                  <p>Avaliability</p>
                </div>
              </div>
            </div>
          )}
          <div className="w-full group">
            <ProgressBarPart2
              progress={progress}
              isOverDue={isOverdue}
              isComplete={isComplete}
            />
            {/* Hover Box */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 hidden opacity-0 group-hover:opacity-100 group-hover:block bg-white rounded shadow p-2">
              <h2 className="text-sm">
                Tracking Stage ● {lastCompletedPartNumber}/11
              </h2>
              <h2 className="text-sm mt-2">{lastCompletedPartTitle} </h2>
            </div>
          </div>
          {isOverdue || isComplete ? (
            <div className="flex justify-end">
              <div className="flex flex-col h-5" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex flex-row text-gray-700">
                <div className="flex justify-center">
                  <h1 className="text-right text-md mt-2 dark:text-white flex mr-2">
                    <FiCalendar size={20} className="mr-2" />
                    {format(postMarkingHandIn, "dd MMM yy")}
                  </h1>
                  <h1
                    className="mt-2 text-md dark:text-white text-center flex"
                    data-cy="trackingStagesComplete"
                  >
                    <FiClock size={20} className="mr-2" />
                    {daysRemaining} Days Left
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

export function AssessmentOverallProgress({ ...props }) {
  const { partsList, handInDate } = props;

  console.assert(
    partsList >= 0,
    "Parts list must contain the last completed part",
  );

  console.assert(handInDate != null, "Dates passed must be valid and exist");

  // Access the last completed part from parts list associated with assessment in props
  let lastCompletedPart = null; // Initialize

  // Error handling in place if last completed part does not exist
  try {
    lastCompletedPart = partsList[0].Part;
  } catch (error) {
    console.error("Error retrieving last completed part:", error);
    // Handle the error gracefully, e.g.,  default lastCompletedPart of not started
    lastCompletedPart = { part_title: "Tracking Not Started", part_number: 0 };
  }

  if (
    lastCompletedPart.part_title === "Mark and feedback availability" ||
    lastCompletedPart.part_title === "Internal moderation of marked sample"
  ) {
    return (
      <AssessmentProgressPart2
        lastCompletedPart={lastCompletedPart}
        handInDate={handInDate}
      />
    );
  } else {
    return <AssessmentProgressPart1 lastCompletedPart={lastCompletedPart} />;
  }
}
