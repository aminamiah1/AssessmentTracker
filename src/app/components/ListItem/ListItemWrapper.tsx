import Link from "next/link";
import React, { Fragment } from "react";

interface ListItemWrapperProps {
  children: React.ReactNode;

  className?: string;
  href?: string;
}

export function ListItemWrapper({
  children,
  className = "",
  href = "",
}: ListItemWrapperProps) {
  const parent = href ? Link : Fragment;

  // If we have an href, we want to wrap the content in a Link component,
  // otherwise we just want to return the content as is
  const content = React.createElement(
    parent,
    { href },
    <div
      data-cy="list-item"
      className={`w-full flex ${href ? "cursor-pointer hover:dark:bg-slate-600 hover:bg-slate-200" : ""} justify-evenly rounded p-4 items-center ${className}`}
    >
      {children}
    </div>,
  );

  return <>{content}</>;
}
