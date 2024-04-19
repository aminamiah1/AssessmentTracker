import Link from "next/link";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { ListItemWrapper } from "./ListItemWrapper";

interface ProgressListItemProps {
  href?: string;

  /** The progress of the item, as a decimal */
  progress: number;

  /** The subtitle of the item */
  subtitle: string;

  /** The main title of the list item */
  title: string;

  /** The text to display next to the progress bar - by default, this shows as XX% complete */
  progressText?: string;
  proforma?: string | null;
}

export function ProgressListItem({
  href,
  progress,
  progressText = progress * 100 + "% complete",
  subtitle,
  title,
  proforma,
}: ProgressListItemProps) {
  console.assert(
    progress >= 0 && progress <= 1,
    "Progress must be between 0 and 1, inclusively",
  );

  const displayProforma = "View Proforma" ?? "No proforma available";

  return (
    <ListItemWrapper href={href} className="border p-4 rounded-md">
      <div className="min-w-max pr-6">
        <h2 className="text-2xl">{title}</h2>
        <h3 className="text-xl">{subtitle}</h3>
        {proforma && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed px-2 py-1"
            disabled={!proforma}
          >
            {proforma ? (
              <Link href={proforma}>View Proforma</Link>
            ) : (
              "Proforma Unavailable"
            )}
          </button>
        )}
      </div>
      <div className="w-[60%] text-center">
        <ProgressBar progress={progress} />
        <span data-cy="progress-text">{progressText}</span>
      </div>
    </ListItemWrapper>
  );
}
