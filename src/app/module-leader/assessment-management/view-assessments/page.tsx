"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import AssessmentTile from "../../../components/module-leader/AssessmentTile";
import { FiArrowLeft } from "react-icons/fi"; // Return arrow icon
import { FiSearch } from "react-icons/fi"; // Search icon
import Link from "next/link";
import AuthContext from "@/app/utils/authContext";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn

interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_id: number;
  module: [];
  setter_id: number;
  module_name: string;
  assignees: [];
}

function ViewAssessmentsModuleLeaders() {
  const [assessments, setAssessments] = useState<Assessment[]>([]); // Variable to hold an array of assessment object types
  const [setterId, setSetterId] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Set the search term to blank for default
  const [isModuleLeader, setIsModuleLeader] = useState(false); // Confirm if the user is a module leader role type
  const { data: session, status } = useSession(); // Use useSession to get session and status

  useEffect(() => {
    if (session != null) {
      // Check here from session.user.roles array if one of the entires is module_leader to set is module leader to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("module_leader")) {
          // Set the assessment setter id to the current user
          setSetterId(parseInt(session.user.id as string, 10));
          // Set the current user as a module leader to true
          setIsModuleLeader(true);
        } else if (roles.includes("module_leader") === false) {
          setIsModuleLeader(false);
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchAssessments = async () => {
      // Fetch assessments only when component mounts
      // Getting response as module leader 1 while waiting for login feature
      const response = await axios.get(
        `/api/module-leader/get-assessments/?id=${setterId}`,
      );
      const sortedAssessments = response.data.sort(
        (a: Assessment, b: Assessment) => a.id - b.id,
      );
      setAssessments(sortedAssessments);
    };

    if (isModuleLeader === true && setterId != 0) {
      fetchAssessments();
    }
  }, [isModuleLeader]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter assessments when user searches by assessment name or module name assessment is tied to.
  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.assessment_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assessment.module_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (status === "loading") {
    return <p className="text-white bg-black">Loading...</p>; // Show a loading message while checking session status
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
    <main className="bg-white">
      <div className="p-4 bg-white h-screen text-black">
        <ToastContainer />
        <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href={"/module-leader/assessment-management"}>
              <FiArrowLeft
                className="cursor-pointer ml-4"
                size={30}
                style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
              />
            </Link>
            <h1 className="text-3xl">Your Assessments Overview</h1>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-3">
            <FiSearch
              className="mr-2 mb-2"
              size={30}
              style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
            />
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Enter module or assessment name..."
              className="p-2 mb-3 shadow-md border-b-4 border-black w-full text-black"
            />
          </div>
        </div>
        <div>
          {filteredAssessments.length > 0 ? (
            <div className="pb-20 mb-20">
              {filteredAssessments.map((assessment) => (
                <AssessmentTile key={assessment.id} assessment={assessment} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              No assessments found matching the search criteria...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const WrappedViewAssessments = () => (
  <AuthContext>
    <ViewAssessmentsModuleLeaders />
  </AuthContext>
);

export default WrappedViewAssessments;
