import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import React from "react";

interface NavItemProps {
  icon: ReactNode;
  isSidebarOpen: boolean;
  href: string;
  text: string;
}

export function NavItem({ icon, isSidebarOpen, href, text }: NavItemProps) {
  const modifiedIcon = React.cloneElement(icon as ReactElement, {
    className:
      "flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white",
  });

  return (
    <li>
      <Link
        href={href}
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        {modifiedIcon}
        <span
          className={`${isSidebarOpen ? "flex-1 ms-3 whitespace-nowrap" : "hidden"} text-lg`}
        >
          {text}
        </span>
      </Link>
    </li>
  );
}
