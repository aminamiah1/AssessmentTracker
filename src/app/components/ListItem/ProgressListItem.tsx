import Link from "next/link";
import { ProgressBar } from "../ProgressBar/ProgressBar";

interface ProgressListItemContent {
  /** The progress of the item, as a decimal */
  progress: number;

  /** The subtitle of the item */
  subtitle: string;

  /** The main title of the list item */
  title: string;

  /** The text to display next to the progress bar */
  progressText: string;
}

function ProgressListItemContent({
  progress,
  progressText,
  subtitle,
  title,
}: ProgressListItemContent) {
  return (
    <>
      <div className="w-full flex justify-evenly rounded p-4 items-center hover:bg-slate-800">
        <div className="min-w-max pr-6">
          <h2 className="text-2xl">{title}</h2>
          <h3 className="text-xl">{subtitle}</h3>
        </div>
        <div className="w-[60%] text-center">
          <ProgressBar progress={progress} />
          <span data-cy="progress-text">{progressText}</span>
        </div>
      </div>
    </>
  );
}

interface ProgressListItemProps extends ProgressListItemContent {
  /** The href to link to */
  href?: string;
}

export function ProgressListItem({ href, ...props }: ProgressListItemProps) {
  const { progress } = props;

  console.assert(
    progress >= 0 && progress <= 1,
    "Progress must be between 0 and 1, inclusively",
  );

  return (
    <>
      {href ? (
        <Link href={href} className="hover:cursor-pointer">
          <ProgressListItemContent {...props} />
        </Link>
      ) : (
        <ProgressListItemContent {...props} />
      )}
    </>
  );
}
