import AssessmentProgressPart1 from "@/app/components/trackingProgress/logicForBars/AssessmentProgressPart1";
import AssessmentProgressPart2 from "@/app/components/trackingProgress/logicForBars/AssessmentProgressPart2";

export function AssessmentOverallProgress({ ...props }) {
  const { partsList, handInDate } = props;

  // Check assessment has parts list and hand in date associated before proceeding
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

  // If the last complete part is not in the "mark and feedback" or "internal moderation" stage then render the first part progress bar
  // Else render the second part progress bar
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
