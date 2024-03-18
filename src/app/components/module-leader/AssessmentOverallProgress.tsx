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
  return (
    <>
      <div className="w-full flex justify-evenly rounded p-4 items-center hover:bg-slate-800">
        <div className="w-[60%] text-center">
          <ProgressBar progress={progress} />
          <span data-cy="progress-text">{progressPartsList}</span>
        </div>
      </div>
    </>
  );
}

export function AssessmentOverallProgress({ ...props }) {
  const { progress } = props;

  console.assert(
    progress >= 0 && progress <= 1,
    "Progress must be between 0 and 1, inclusively",
  );

  return (
    <>
      <AssessmentProgressBar
        progress={0.2}
        progressPartsList={["part_1", "part_2"]}
      />
    </>
  );
}
