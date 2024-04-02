"use client";
import UnauthorizedAccess from "@/app/components/authError";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSession } from "next-auth/react"; // Import useSession and signIn
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { FaChartLine } from "react-icons/fa";

export default function overdueStatisticsPSTeam() {
  const { data: session, status } = useSession({ required: true }); // Use useSession to get session and status

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isPSTeam = session.user.roles.includes("ps_team");
  return isPSTeam ? (
    <div className="bg-white dark:bg-darkmode h-screen max-h-full">
      <aside
        id="analytics-sidebar"
        className={`fixed top-0 right-0 z-20 h-screen pt-20 bg-white border-r border-gray-300 dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out shadow-md`}
        aria-label="Sidebar"
      >
        <button className="mx-2 mt-1 text-lg font-bold flex items-center">
          <FaChartLine size={30} className="mr-2" />
          Graph 1
        </button>
        <button className="mx-2 mt-10 text-lg font-bold flex items-center">
          <FaChartLine size={30} className="mr-2" />
          Graph 2
        </button>
        <button className="mx-2 mt-10 text-lg font-bold flex items-center">
          <FaChartLine size={30} className="mr-2" />
          Graph 3
        </button>
      </aside>
      <ToastContainer />
      <div className="text-center mb-10 mt-10">
        <h1 className="text-3xl">Overdue Statistics</h1>
      </div>
      <div className="flex justify-center items-center pt-38"></div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}
