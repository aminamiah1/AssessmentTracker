import { ProgressBarOverall } from "@/app/components/module-leader/ProgressBarOverall";
interface OverallProgressContent {
  /** Passing assessment hand in date and hand out date here to visualise time difference */
  handInDate: string;
  handOutDate: string;
  // Last completed part title and number needed to render overall progress visual for assessment
}

function TimeProgressBar({ handInDate, handOutDate }: OverallProgressContent) {
  return (
    <div className="w-full flex justify-evenly rounded p-4">
      <div className="w-[60%] relative overflow-hidden text-left">
        {/* Display the visual date progress*/}
        <>
          <div>
            <ProgressBarOverall progress={0.1} />
          </div>
        </>
      </div>
    </div>
  );
}

export function TimeOverallProgress({ ...props }) {
  const { handInDate, handOutDate } = props;

  console.assert(
    handInDate != null && handOutDate != null,
    "Dates passed must be valid and exist",
  );

  return <TimeProgressBar handInDate={"example"} handOutDate={"example"} />;
}
