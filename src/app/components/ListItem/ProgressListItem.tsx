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
}

export function ProgressListItem({
  href,
  progress,
  progressText = progress * 100 + "% complete",
  subtitle,
  title,
}: ProgressListItemProps) {
  console.assert(
    progress >= 0 && progress <= 1,
    "Progress must be between 0 and 1, inclusively",
  );

  return (
    <ListItemWrapper href={href}>
      <div className="min-w-max pr-6">
        <h2 className="text-2xl">{title}</h2>
        <h3 className="text-xl">{subtitle}</h3>
      </div>
      <div className="w-[60%] text-center">
        <ProgressBar progress={progress} />
        <span data-cy="progress-text">{progressText}</span>
      </div>
    </ListItemWrapper>
  );
}
