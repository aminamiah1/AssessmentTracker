import { TimeBar } from "@/app/components/TimeProgressBar/TimeBar";
interface OverallProgressContent {
  /** The array containing the text and current number of the last completed part for an assessment */
  lastCompletedPart: {
    part_title: string;
    part_number: number;
  }; // Last completed part title and number needed to render overall progress visual for assessment
}

function AssessmentProgressBar({ lastCompletedPart }: OverallProgressContent) {
  // Get the last completed part title and number from object
  const lastCompletedPartTitle = lastCompletedPart.part_title;
  const lastCompletedPartNumber = lastCompletedPart.part_number;
  const progress = lastCompletedPartNumber / 10; // Divide last part number by the maximum number of parts (10) for first tracking stage to get progress decimal
  // Calculate the width of the completed portion of the progress bar
  const progressBarWidth = 100;
  const completedWidth = progress * progressBarWidth; //Calculate where to place last completed part text

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
                  Internal Moderation
                </h1>
              </div>
              <div>
                <h1
                  className="mb-4 ml-4 text-md text-gray-700 dark:text-white"
                  data-cy="trackingStagesComplete"
                >
                  Moderation Panel
                </h1>
              </div>
              <div>
                <h1
                  className="mb-4 ml-4 text-md text-gray-700 dark:text-white"
                  data-cy="trackingStagesComplete"
                >
                  External Examiner
                </h1>
              </div>
              <div>
                <h1
                  className="mb-4 ml-4 text-md text-gray-700 dark:text-white"
                  data-cy="trackingStagesComplete"
                >
                  Post-Marking Moderation
                </h1>
              </div>
            </div>
            {/* Display the tracking form stages progress as visual bar*/}
            <div className="w-full">
              <TimeBar
                progress={progress}
                isComplete={false}
                isOverDue={false}
              />
            </div>
            <div>
              <div
                className="mt-2 text-lg text-gray-700 dark:text-white"
                style={{ width: `${completedWidth}%`, textAlign: "right" }}
              >
                {/* <span data-cy="lastCompletedPart">
                  {lastCompletedPartTitle}
                </span> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
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

  return <AssessmentProgressBar lastCompletedPart={lastCompletedPart} />;
}
