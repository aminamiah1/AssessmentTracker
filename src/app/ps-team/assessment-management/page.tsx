"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import AssessmentTilePS from "../../components/ps-team/AssessmentTilePS";
import Link from "next/link";
import AuthContext from "@/app/utils/authContext";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn
import { FiArrowLeft } from "react-icons/fi"; // Return arrow icon
import { FiSearch } from "react-icons/fi"; // Search icon

interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_id: number;
  module: [];
  setter_id: number;
  setter: { name: string };
  module_name: string;
  assignees: [];
}

function ViewAssessmentsPSTeam() {
  const [assessments, setAssessments] = useState<Assessment[]>([]); // Variable to hold an array of assessment object types
  const [searchTerm, setSearchTerm] = useState(""); // Set the search term to blank for default
  const [isPSTeam, setIsPSTeam] = useState(false); // Confirm if the user is a ps team role type
  const { data: session, status } = useSession(); // Use useSession to get session and status

  useEffect(() => {
    if (session != null) {
      // Check here from session.user.roles array if one of the entires is ps_team to set is ps team to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("ps_team")) {
          // Set the current user as a ps team to true
          setIsPSTeam(true);
        } else if (roles.includes("ps_team") === false) {
          setIsPSTeam(false);
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
      const response = await axios.get(`/api/ps-team/assessments/get`);
      const sortedAssessments = response.data.sort(
        (a: Assessment, b: Assessment) => a.id - b.id,
      );
      console.log(sortedAssessments);
      setAssessments(sortedAssessments);
    };

    if (isPSTeam === true) {
      fetchAssessments();
    }
  }, [isPSTeam]);

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

  if (isPSTeam === false) {
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
            <h1 className="text-3xl">All Assessments Overview</h1>
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
                <AssessmentTilePS key={assessment.id} assessment={assessment} />
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
    <ViewAssessmentsPSTeam />
  </AuthContext>
);

export default WrappedViewAssessments;
