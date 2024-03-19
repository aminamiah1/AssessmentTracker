import { ProgressBar } from "../ProgressBar/ProgressBar";

interface OverallProgressContent {
  /** The array containing the text of the complemented parts so far to display next to the progress bar */
  partsList: string[];
}

function AssessmentProgressBar({ partsList }: OverallProgressContent) {
  // Get the last completed part title
  const completedParts = partsList.length; // Get the number of completed parts
  const progress = completedParts / 11; // Divide by the maximum number of parts (11) to get progress
  const lastCompletedPart = partsList[partsList.length - 1]; //Get text name of last completed part
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
  const { partsList } = props;

  console.assert(partsList >= 0, "Parts list must contain 0 or more parts");

  return <AssessmentProgressBar partsList={partsList} />;
}
