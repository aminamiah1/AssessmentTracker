import { TimeBar } from "@/app/components/TimeProgressBar/TimeBar";
import { format, differenceInMilliseconds, differenceInDays } from "date-fns"; // Import necessary functions
interface OverallProgressContent {
  /** Passing assessment hand in date and hand out date here to visualise time difference */
  handInDate: Date;
  handOutDate: Date;
  // Last completed part title and number needed to render overall progress visual for assessment
}

function TimeProgressBar({ handInDate, handOutDate }: OverallProgressContent) {
  // Calculate progress for the bar using date-fns
  const totalTime = differenceInMilliseconds(handInDate, handOutDate);
  const elapsedTime = differenceInMilliseconds(new Date(), handOutDate);
  let progress = Math.min(1, elapsedTime / totalTime);
  // Check and render if overdue or how many days left
  const daysRemaining = differenceInDays(handInDate, new Date()); // Difference in days
  const isOverdue = daysRemaining < 0;
  const timeLabel = isOverdue ? "Days Overdue" : "Days Left";
  const days = Math.abs(daysRemaining); // Absolute value for both left or overdue.
  // Calculate the width of the completed portion of the progress bar
  const progressBarWidth = 100;
  const completedWidth = progress * progressBarWidth; //Calculate where to place last completed part text

  return (
    <div className="w-full flex justify-evenly rounded p-4">
      <div className="w-[60%] relative overflow-hidden text-left">
        {/* Display the visual date progress*/}
        <>
          <h1
            className="mb-4 text-lg text-gray-700 dark:text-white"
            data-cy="trackingStagesComplete"
            style={{ textAlign: "right" }}
          >
            {timeLabel} ● {days}
          </h1>
          <div>
            <TimeBar progress={progress} />
          </div>
          <div className="flex">
            <div className="text-lg text-gray-700 dark:text-white w-full text-left">
              <p data-cy="dateShowHandOut">
                {format(handOutDate, "dd MMM yy")}
              </p>
            </div>
            <div className="text-lg text-gray-700 dark:text-white w-full text-right">
              <p data-cy="dateShowHandIn">{format(handInDate, "dd MMM yy")}</p>
            </div>
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

  return <TimeProgressBar handInDate={handInDate} handOutDate={handOutDate} />;
}
