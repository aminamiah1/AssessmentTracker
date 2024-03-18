import { ProgressBar } from "../ProgressBar/ProgressBar";

interface OverallProgressContent {
  /** The progress of the item, as a decimal */
  progress: number;

  /** The array containing the text of the complemented parts so far to display next to the progress bar */
  progressPartsList: string[];
}

function AssessmentProgressBar({
  progress,
  progressPartsList,
}: OverallProgressContent) {
  // Get the last completed part title
  const completedParts = Math.floor(progress * progressPartsList.length); // Adjust for indexing
  const lastCompletedPart = progressPartsList[completedParts];
  // Calculate the width of the completed portion of the progress bar
  const progressBarWidth = 100;
  const completedWidth = progress * progressBarWidth; //Calculate where to place last completed part text

  return (
    <div className="w-full flex justify-evenly rounded p-4 items-center hover:bg-slate-800 relative">
      <div className="w-[60%] relative overflow-hidden">
        <ProgressBar progress={progress} />
        {/* Only display the last part title */}
        {lastCompletedPart && (
          <div style={{ width: `${completedWidth}%`, textAlign: "right" }}>
            <span className="font-bold">{lastCompletedPart}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AssessmentOverallProgress({ ...props }) {
  const { progress } = props;
  const maxParts = 11; // Maximum number of parts
  const exampleProgressPartsList = Array.from(
    { length: maxParts },
    (_, index) => `Assessment Tracking 10${index + 1}`,
  ); // Example parts list

  console.assert(
    progress >= 0 && progress <= 1,
    "Progress must be between 0 and 1, inclusively",
  );

  return (
    <AssessmentProgressBar
      progress={0.4}
      progressPartsList={exampleProgressPartsList}
    />
  );
}
