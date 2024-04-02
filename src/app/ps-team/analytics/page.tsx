"use client";
import UnauthorizedAccess from "@/app/components/authError";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSession } from "next-auth/react"; // Import useSession and signIn
import Link from "next/link";
import { ToastContainer } from "react-toastify";

export default function analyticsPSTeam() {
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
      <ToastContainer />
      <div className="text-center mb-10 mt-10">
        <h1 className="text-3xl">View Analytics</h1>
      </div>
      <div className="flex justify-center items-center pt-38">
        <div className="mb-0">
          <Link href="analytics/overdue-statistics">
            <button className="bg-gray-800 text-white h-32 md:h-80 w-32 md:w-80 flex flex-col justify-center items-center rounded-lg shadow-md hover:bg-gray-700 focus:outline-none">
              <div>
                <i className="bi bi-alarm text-5xl md:text-9xl"></i>
              </div>
              <div className="mt-10 text-xl">Overdue Statistics</div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}
