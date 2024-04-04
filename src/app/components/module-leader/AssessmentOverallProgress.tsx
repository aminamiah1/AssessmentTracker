import { ProgressBarPart1 } from "@/app/components/module-leader/ProgressBarPart1";
import { format, differenceInDays } from "date-fns"; // Import necessary functions
import { FiCalendar, FiClock, FiCheck } from "react-icons/fi";
interface OverallProgressContent {
  /** The array containing the text and current number of the last completed part for an assessment */
  lastCompletedPart: {
    part_title: string;
    part_number: number;
  }; // Last completed part title and number needed to render overall progress visual for assessment
}

function AssessmentProgressPart1({
  lastCompletedPart,
}: OverallProgressContent) {
  // Get the last completed part title and number from object
  const lastCompletedPartTitle = lastCompletedPart.part_title;
  const lastCompletedPartNumber = lastCompletedPart.part_number;
  const progress = lastCompletedPartNumber / 10; // Divide last part number by the maximum number of parts (10) for first tracking stage to get progress decimal
  // Calculate the width of the completed portion of the progress bar
  const progressBarWidth = 100;
  const completedWidth = progress * progressBarWidth; //Calculate where to place last completed part text

  // Caluclate time from now till the next july the 1st
  const daysRemaining = differenceInDays(
    new Date(
      new Date().getFullYear() + (new Date().getMonth() >= 6 ? 1 : 0),
      6,
      1,
    ),
    new Date(),
  ); // Day difference between now and hand in date
  const isOverdue = daysRemaining < 0; // Check if overdue i.e. minus day difference numbers
  const isComplete =
    lastCompletedPart.part_title === "Internal moderation of marked sample" ||
    lastCompletedPart.part_title === "Mark and feedback availability";
  // Check if complete by comparing part title to the two stages after final section 4 stage

  return (
    <div className="w-full flex justify-evenly rounded p-4">
      <div className="w-[60%] relative overflow-hidden text-left">
        {/* Display the last completed part information*/}
        {lastCompletedPart && (
          <>
            <div className="flex">
              <div>
                <h1
                  className="mb-4 text-md text-gray-700 dark:text-white"
                  data-cy="trackingStagesComplete"
                >
                  Internal Peer Moderation Feedback
                </h1>
              </div>
              <div>
                <h1
                  className="mb-4 ml-4 text-md text-gray-700 dark:text-white"
                  data-cy="trackingStagesComplete"
                >
                  Moderation Panel Comments
                </h1>
              </div>
              <div>
                <h1
                  className="mb-4 ml-4 text-md text-gray-700 dark:text-white"
                  data-cy="trackingStagesComplete"
                >
                  External Examiner Feedback
                </h1>
              </div>
              <div>
                <h1
                  className="mb-4 ml-4 text-md text-gray-700 dark:text-white"
                  data-cy="trackingStagesComplete"
                >
                  Post Marking Moderation
                </h1>
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
            <div className="flex justify-end">
              {!isComplete && (
                <div className="flex flex-col">
                  <h1
                    className="mt-4 text-md text-gray-700 dark:text-white text-center flex justify-center"
                    data-cy="trackingStagesComplete"
                  >
                    <FiCalendar size={20} className="mr-2 flex" />
                    {daysRemaining} Days Left
                  </h1>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AssessmentProgressPart2({
  lastCompletedPart,
}: OverallProgressContent) {
  // Dynamically render progress bar 2 if in last tracking stage to complete post hand out marks
  return <h1>PlaceHolder</h1>;
}

export function AssessmentOverallProgress({ ...props }) {
  const { partsList } = props;

  console.assert(
    partsList >= 0,
    "Parts list must contain the last completed part",
  );

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
    return <AssessmentProgressPart2 lastCompletedPart={lastCompletedPart} />;
  } else {
    return <AssessmentProgressPart1 lastCompletedPart={lastCompletedPart} />;
  }
}
