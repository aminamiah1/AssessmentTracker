"use client";

import UnauthorizedAccess from "@/app/components/authError";
import { AssessmentLoad } from "@/app/types/interfaces";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiSearch } from "react-icons/fi"; // Return arrow icon
import { ToastContainer } from "react-toastify";
import AssessmentTile from "../../../components/module-leader/AssessmentTile";

export default function ViewAssessmentsModuleLeaders() {
  const [assessments, setAssessments] = useState<AssessmentLoad[]>([]); // Variable to hold an array of assessment object types
  const [setterId, setSetterId] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Set the search term to blank for default
  const { data: session, status } = useSession({ required: true }); // Use useSession to get session and status

  useEffect(() => {
    const fetchAssessments = async () => {
      // Fetch assessments only when component mounts
      try {
        const response = await fetch(
          `/api/module-leader/assessments/get?id=${setterId}`,
        );
        const data = await response.json();
        const sortedAssessments = data.sort(
          (a: AssessmentLoad, b: AssessmentLoad) => a.id - b.id,
        );
        setAssessments(sortedAssessments);
      } catch (e) {
        setAssessments([]);
      }
    };

    if (isModuleLeader && setterId !== 0) {
      fetchAssessments();
    }
  }, [setterId]);

  useEffect(() => {
    if (status === "authenticated" && isModuleLeader) {
      setSetterId(+session.user.id);
    }
  }, [status]);

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isModuleLeader = session.user.roles.includes("module_leader");

  return isModuleLeader ? (
    <main className="bg-white dark:bg-darkmode">
      <div className="bg-white dark:bg-darkmode h-screen max-h-full">
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
            <div className="text-center dark:text-white">
              No assessments found matching the search criteria...
            </div>
          )}
        </div>
      </div>
    </main>
  ) : (
    <UnauthorizedAccess />
  );
}
