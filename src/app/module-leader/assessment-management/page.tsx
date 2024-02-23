"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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
    return <p>Loading...</p>; // Show a loading message while checking session status
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>; // This will be briefly shown before the signIn() effect redirects the user
  }

  if (isModuleLeader === false) {
    return <p>You are not authorised to view this page...</p>; // Alert the current user that they do not have the role privilege to access the current page
  }

  return (
    <div className="p-4 bg-white h-screen">
      <ToastContainer />
      <div className="text-center mb-8 mt-8">
        <h1 className="text-3xl">Your Assessments</h1>
      </div>
      <div className="flex justify-center items-center pt-40">
        <div className="mb-8">
          <Link href="/module-leader/assessment-management/create-assessment">
            <button className="bg-gray-800 text-white h-80 w-80 flex flex-col justify-center items-center rounded-lg shadow-md hover:bg-gray-700 focus:outline-none mr-5">
              <div>
                <i className="bi bi-newspaper text-9xl"></i>
              </div>
              <div>Create Assessment</div>
            </button>
          </Link>
        </div>
        <div className="mb-8">
          <Link href="/module-leader/assessment-management/view-assessments">
            <button className="bg-gray-800 text-white h-80 w-80 flex flex-col justify-center items-center rounded-lg shadow-md hover:bg-gray-700 focus:outline-none">
              <div>
                <i className="bi bi-envelope-paper text-9xl"></i>
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
