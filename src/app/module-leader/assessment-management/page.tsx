"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthContext from "@/app/utils/authContext";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn

function ManageAssessmentsModuleLeaders() {
  const { data: session, status } = useSession(); // Use useSession to get session and status
  const [isModuleLeader, setIsModuleLeader] = useState(false); // Confirm if the user is a module leader role type

  useEffect(() => {
    if (session != null) {
      // Check here from session.user.roles array if one of the entires is module_leader to set is module leader to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("module_leader")) {
          // Set the current user as a module leader to true
          setIsModuleLeader(true);
        } else if (roles.includes("module_leader") === false) {
          setIsModuleLeader(false);
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      // If not a authenticated user then make them sign-in
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>; // This will be briefly shown before the signIn() effect redirects the user
  }

  if (isModuleLeader === false) {
    return (
      <p className="text-white bg-black">
        You are not authorised to view this page...
      </p>
    ); // Alert the current user that they do not have the role privilege to access the current page
  }

  return (
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
  );
}

const WrappedAssessmentManagement = () => (
  <AuthContext>
    <ManageAssessmentsModuleLeaders />
  </AuthContext>
);

export default WrappedAssessmentManagement;
