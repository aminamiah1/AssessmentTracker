"use client";

import UnauthorizedAccess from "@/app/components/authError";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSession } from "next-auth/react"; // Import useSession and signIn
import Link from "next/link";
import { ToastContainer } from "react-toastify";

export default function ManageAssessmentsModuleLeaders() {
  const { data: session, status } = useSession({ required: true }); // Use useSession to get session and status

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isModuleLeader = session.user.roles.includes("module_leader");
  return isModuleLeader ? (
    <div className="bg-white dark:bg-darkmode h-screen max-h-full">
      <ToastContainer />
      <div className="text-center mb-10 mt-10">
        <h1 className="text-3xl">Your Assessments</h1>
      </div>
      <div className="flex justify-center items-center pt-38">
        <div className="mb-0">
          <Link href="/module-leader/assessment-management/create-assessment">
            <button className="bg-gray-800 text-white h-32 md:h-80 w-32 md:w-80 flex flex-col justify-center items-center rounded-lg shadow-md hover:bg-gray-700 focus:outline-none">
              <div>
                <i className="bi bi-newspaper text-5xl md:text-9xl"></i>
              </div>
              <div>Create Assessment</div>
            </button>
          </Link>
        </div>
        <div className="mb-0">
          <Link href="/module-leader/assessment-management/view-assessments">
            <button className="bg-gray-800 text-white h-32 md:h-80 w-32 md:w-80 ml-2 flex flex-col justify-center items-center rounded-lg shadow-md hover:bg-gray-700 focus:outline-none">
              <div>
                <i className="bi bi-envelope-paper text-5xl md:text-9xl"></i>
              </div>
              <div>View Assessments Created</div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}
