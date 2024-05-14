"use client";

import UserMenu from "@/app/components/navbarPopUps/userMenu"; // Import the UserMenu component
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { FC, PropsWithChildren, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClipboardCheck,
  FaClipboardList,
  FaTable,
  FaList,
  FaUsers,
  FaBox,
  FaListAlt,
} from "react-icons/fa";
import { NavItem } from "@/app/components/ListItem/NavItem";
import DarkModeToggle from "@/app/components/darkModeToggle";

interface NavbarProps {}

export const Navbar: FC<PropsWithChildren<NavbarProps>> = ({ children }) => {
  const { data: session, status } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State to manage user menu open/close
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen); // Toggle open/close state function
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return <main>{children}</main>;
  }

  const isPSTeam = session.user.roles.includes("ps_team");
  const isModuleLeader = session.user.roles.includes("module_leader");
  const isInternalModerator = session.user.roles.includes("internal_moderator");
  const isExternalExaminer = session.user.roles.includes("external_examiner");
  const isPanelMember = session.user.roles.includes("panel_member");

  /**
   * This check is preferred over a blanket !isPSTeam check because of an
   * edge case where a user might be a module leader (or internal moderator,
   * external examiner, panel member) and a PS team member - in that case,
   * the TODO and Completed Tasks pages wouldn't appear in the sidenav
   */
  const hasTodoRelatedRole =
    isModuleLeader ||
    isInternalModerator ||
    isExternalExaminer ||
    isPanelMember;

  const moduleListRole = isModuleLeader || isPSTeam;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700 shadow-md">
        <div className="px-3 py-5 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <Link href="/" className="flex ms-2 md:me-24">
                <Image
                  src="/images/logo.png"
                  className="h-8 me-3"
                  alt="Logo"
                  width={36}
                  height={10}
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white text-black">
                  Assessment Tracker
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className="mr-7 h-auto">
                  <DarkModeToggle />
                </div>
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-cy="profilePic"
                    data-dropdown-toggle="dropdown-user"
                    onClick={toggleUserMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      src="/images/profile.png"
                      className="w-10 h-10 rounded-full"
                      alt="user photo"
                      width={35}
                      height={10}
                    />
                  </button>
                  {/* Render UserMenu component conditionally based on state controlled by clicking profile picture */}
                  <UserMenu isOpen={isUserMenuOpen} />
                </div>
                <p className="text-black ml-4 dark:text-white">
                  {session ? session.user.name : ""}
                </p>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-20 h-screen pt-20 bg-white border-r border-gray-300 dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out shadow-md ${
          isSidebarOpen ? "min-w-max" : "w-16"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {isPSTeam && (
              <>
                <NavItem
                  icon={<FaUsers />}
                  isSidebarOpen={isSidebarOpen}
                  href="/ps-team/user-management"
                  text="User Management"
                />
              </>
            )}
            {moduleListRole && (
              <>
                <NavItem
                  icon={<FaList />}
                  isSidebarOpen={isSidebarOpen}
                  href="/admin/module-list"
                  text="Module List"
                />
              </>
            )}
            {isPSTeam && (
              <>
                <NavItem
                  icon={<FaListAlt />}
                  isSidebarOpen={isSidebarOpen}
                  href="/ps-team/assessment-management"
                  text="Assessment Management"
                />
              </>
            )}
            {isModuleLeader && (
              <>
                <NavItem
                  icon={<FaTable />}
                  isSidebarOpen={isSidebarOpen}
                  href="/module-leader/assessment-management"
                  text="My Assessments"
                />
              </>
            )}
            {hasTodoRelatedRole && (
              <>
                <NavItem
                  icon={<FaClipboardList />}
                  isSidebarOpen={isSidebarOpen}
                  href="/todo"
                  text="Todos"
                />
                <NavItem
                  icon={<FaClipboardCheck />}
                  isSidebarOpen={isSidebarOpen}
                  href="/done"
                  text="Completed Tasks"
                />
              </>
            )}
            <NavItem
              href="/api/auth/signout"
              isSidebarOpen={isSidebarOpen}
              text="Sign Out"
              icon={
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                  />
                </svg>
              }
            />
          </ul>
          <div className="flex justify-center pb-4">
            <button
              onClick={toggleSidebar}
              className="absolute bottom-0 left-0 w-full p-2 text-gray-500 bg-white rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              style={{ marginBottom: "env(safe-area-inset-bottom)" }}
            >
              {isSidebarOpen ? (
                <FaArrowLeft className="mx-auto h-6 w-6" />
              ) : (
                <FaArrowRight className="mx-auto h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </aside>
      <main
        className={`ml-16 ${isSidebarOpen ? "pl-64" : "pl-16"} absolute right-0 top-20 w-full h-screen bg-white dark:bg-darkmode`}
      >
        {children}
      </main>
    </>
  );
};

const WrappedNavbar: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Navbar>{children}</Navbar>
);

export default WrappedNavbar;
