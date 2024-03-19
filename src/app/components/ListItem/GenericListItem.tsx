import { ListItemWrapper } from "./ListItemWrapper";

interface GenericListItemProps {
  title: string;
  subtitle: string;

  className?: string;
  href?: string;
  sideText?: string;
}

export function GenericListItem({
  title,
  subtitle,
  className = "",
  sideText,
  href,
}: GenericListItemProps) {
  return (
    <ListItemWrapper className={className} href={href}>
      <div className="min-w-max pr-6">
        <h2 className="text-2xl">{title}</h2>
        <h3 className="text-xl">{subtitle}</h3>
      </div>
      {sideText && <span data-cy="side-text">{sideText}</span>}
    </ListItemWrapper>
  );
}
