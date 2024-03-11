"use client";
import React, { useState, FC, PropsWithChildren, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import AuthContext from "../utils/authContext";
import DarkModeToggle from "./darkModeToggle";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFile,
  FaList,
  FaUsers,
} from "react-icons/fa";
import UserMenu from "./navbarPopUps/UserMenu"; // Import the UserMenu component

interface NavbarProps {}

const Navbar: FC<PropsWithChildren<NavbarProps>> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const [isPSTeam, setIsPSTeam] = useState(false);
  const [isModuleLeader, setIsModuleLeader] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State to manage user menu open/close
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen); // Toggle open/close state function

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/admin/sign-in"
    ) {
      setShowNavbar(false);
      return;
    }

    if (session) {
      const roles = session.user.roles || [];
      setIsPSTeam(roles.includes("ps_team"));
      setIsModuleLeader(roles.includes("module_leader"));
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [session, status]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!showNavbar) {
    return <>{children}</>;
  }

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
          isSidebarOpen ? "w-64" : "w-16"
        } relative`}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {isPSTeam && (
              <>
                <li>
                  <Link
                    href="/admin/module-list"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <FaList className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span
                      className={`${isSidebarOpen ? "flex-1 ms-3 whitespace-nowrap" : "hidden"} text-lg`}
                    >
                      Module List
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ps-team/user-management"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <FaUsers className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span
                      className={`${isSidebarOpen ? "flex-1 ms-3 whitespace-nowrap" : "hidden"} text-lg`}
                    >
                      User Management
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ps-team/assessment-management"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <FaFile className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span
                      className={`${isSidebarOpen ? "flex-1 ms-3 whitespace-nowrap" : "hidden"} text-lg`}
                    >
                      PS Team Assessments
                    </span>
                  </Link>
                </li>
              </>
            )}
            {isModuleLeader && (
              <li>
                <Link
                  href="/module-leader/assessment-management"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FaFile className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span
                    className={`${isSidebarOpen ? "flex-1 ms-3 whitespace-nowrap" : "hidden"} text-lg`}
                  >
                    Assessment Management
                  </span>
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/api/auth/signout"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
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
                <span
                  className={`${isSidebarOpen ? "flex-1 ms-3 whitespace-nowrap" : "hidden"} text-lg`}
                >
                  Sign Out
                </span>
              </Link>
            </li>
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
        className={`ml-16 ${isSidebarOpen ? "pl-64" : "pl-16"} fixed right-0 top-[7vh] w-full overflow-y-auto bg-white`}
      >
        {children}
      </main>
    </>
  );
};

const WrappedNavbar: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <AuthContext>
    <Navbar>{children}</Navbar>
  </AuthContext>
);

export default WrappedNavbar;
