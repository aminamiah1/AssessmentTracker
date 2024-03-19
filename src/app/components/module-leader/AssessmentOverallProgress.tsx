import { ProgressBar } from "../ProgressBar/ProgressBar";

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
  const progress = lastCompletedPartNumber / 11; // Divide last part number by the maximum number of parts (11) to get progress decimal
  // Calculate the width of the completed portion of the progress bar
  const progressBarWidth = 100;
  const completedWidth = progress * progressBarWidth; //Calculate where to place last completed part text

  return (
    <div className="w-full flex justify-evenly rounded p-4 items-center relative">
      <div className="w-[60%] relative overflow-hidden">
        <h1 className="mb-4">Last Completed Stage</h1>
        {/* Display the tracking form stages progress as visual bar*/}
        <ProgressBar progress={progress} />
        {/* Display the last completed part information*/}
        {lastCompletedPart && (
          <div>
            <div style={{ width: `${completedWidth}%`, textAlign: "right" }}>
              <span className="font-bold">{lastCompletedPartTitle}</span>
            </div>
            <div className="mt-6" style={{ textAlign: "left" }}>
              <span className="font-bold">
                Tracking Stages Complete: {lastCompletedPartNumber}/11
              </span>
            </div>
          </div>
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
