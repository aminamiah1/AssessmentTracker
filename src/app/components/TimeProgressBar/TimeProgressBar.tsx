import { TimeBar } from "@/app/components/TimeProgressBar/TimeBar";
import { format, differenceInMilliseconds, differenceInDays } from "date-fns"; // Import necessary functions
import { FiCalendar } from "react-icons/fi";
interface OverallProgressContent {
  /** Passing assessment hand in date and hand out date here to visualise time difference */
  handInDate: Date;
  handOutDate: Date;
  lastCompletedPart: {
    part_title: string;
    part_number: number;
  }; // Last completed part title and number needed to render overall progress visual for assessment
}

function TimeProgressBar({
  handInDate,
  handOutDate,
  lastCompletedPart,
}: OverallProgressContent) {
  // Calculate progress for the bar using date-fns
  const daysRemaining = differenceInDays(handInDate, new Date()); // Day difference between now and hand in date
  const isOverdue = daysRemaining < 0; // Check if overdue i.e. minus day difference numbers

  // Calculate progress conditionally
  let progress;
  if (isOverdue) {
    progress = 1;
    // If overdue, progress is complete
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
  const days = Math.abs(daysRemaining);

  // Only show date progress if tracking not complete
  return lastCompletedPart.part_title != "Mark and feedback availability" ? (
    <div className="w-full flex justify-evenly rounded p-4 mb-4">
      <div className="w-[60%] relative overflow-hidden text-center">
        {/* Display the visual date progress*/}
        <>
          {isOverdue ? (
            <h1 className="mb-4 text-lg text-gray-700 dark:text-white text-right">
              {timeLabel}
            </h1>
          ) : (
            <h1 className="mb-4 text-lg justify-center text-gray-700 dark:text-white text-center w-full flex mb-6">
              <FiCalendar size={30} className="mr-2 flex" />
              {days} {timeLabel}
            </h1>
          )}
          <div className="mt-6">
            <TimeBar progress={progress} isOverDue={isOverdue} />
          </div>
          <div className="flex">
            <div className="text-lg text-gray-700 dark:text-white w-full text-left mt-2">
              <p data-cy="dateShowHandOut">
                {isOverdue ? "" : format(handOutDate, "dd MMM yy")}
              </p>
            </div>
            <div className="text-lg text-gray-700 dark:text-white w-full text-right mt-2">
              <p data-cy="dateShowHandIn">{format(handInDate, "dd MMM yy")}</p>
            </div>
          </div>
        </>
      </div>
    </div>
  ) : (
    <p className="text-center">Tracking complete</p>
  );
}

export function TimeOverallProgress({ ...props }) {
  const { handInDate, handOutDate, partsList } = props;

  console.assert(
    handInDate != null && handOutDate != null,
    "Dates passed must be valid and exist",
  );

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

  return (
    <TimeProgressBar
      handInDate={handInDate}
      handOutDate={handOutDate}
      lastCompletedPart={lastCompletedPart}
    />
  );
}
