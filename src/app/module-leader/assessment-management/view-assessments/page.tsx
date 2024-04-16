"use client";

import UnauthorizedAccess from "@/app/components/authError";
import { AssessmentLoad, Part } from "@/app/types/interfaces";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiSearch, FiFilter } from "react-icons/fi"; // Return arrow icon
import { ToastContainer } from "react-toastify";
import Select from "react-select";
import AssessmentTile from "@/app/components/module-leader/AssessmentTile";

export default function ViewAssessmentsModuleLeaders() {
  const [assessments, setAssessments] = useState<AssessmentLoad[]>([]); // Variable to hold an array of assessment object types
  const [setterId, setSetterId] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Set the search term to blank for default
  const [parts, setParts] = useState<{ value: string; label: string }[]>([]); // Parts select array
  const { data: session, status } = useSession({ required: true }); // Use useSession to get session and status
  const [selectedOption, setSelectedOption] = useState({
    value: "",
    label: "",
  }); // Variable to hold the current selected option

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

    const fetchParts = async () => {
      // Fetch parts only when component mounts
      try {
        const response = await fetch(`/api/module-leader/parts/get`);
        const data = await response.json();
        // Insert the 'Process Not Started' option at the beginning
        const partsForSelect = [
          { value: "Process Not Started", label: "Process Not Started" },
          ...data.map((data: Part) => ({
            value: data.part_title,
            label: data.part_title,
          })),
        ];
        setParts(partsForSelect);
      } catch (e) {
        setParts([]);
      }
    };

    if (isModuleLeader && setterId !== 0) {
      fetchAssessments();
      fetchParts();
    }
  }, [setterId]);

  useEffect(() => {
    if (status === "authenticated" && isModuleLeader) {
      setSetterId(+session.user.id);
    }
  }, [status]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption({
      value: "",
      label: "",
    });
    setSearchTerm(event.target.value);
  };

  // Filter assessments when user searches by assessment name or module name or part assessment is tied to.
  const filteredAssessments = assessments.filter(
    (assessment) =>
      // @ts-ignore
      // Had to do this due to parts list on assessment retrieved being hard to work with as double nested list format,
      // however optional chaining is used here to prevent issues of part list not being present for an assessment
      ((assessment.partSubmissions as [][])?.[0]?.Part === undefined &&
        selectedOption.value === "Process Not Started") ||
      // @ts-ignore
      // Filter by part title with search term associated
      (assessment.partSubmissions as [][])?.[0]?.Part?.part_title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assessment.assessment_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assessment.module_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Using any here as the selected option can come in multiple formats
  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption.value != "") {
      setSearchTerm(selectedOption ? selectedOption.value : "");
      setSelectedOption(selectedOption);
    }
  };

  // Handle resetting the search term and selected filter option on button click
  const handleReset = () => {
    setSearchTerm(""); // Reset search term
    setSelectedOption({ value: "", label: "" }); // Reset selected option
  };

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
          <div className="flex items-center mb-3 ml-2">
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
              data-cy="assessmentLeaderSearch"
              placeholder="Enter module or assessment name or tracking stage..."
              className="p-2 mb-3 shadow-md border-b-4 border-black w-full mr-2 text-black"
            />
          </div>
          <div className="flex flex-col min-[1600px]:flex-row items-center mb-3 mr-2 ml-2">
            <FiFilter className="mr-2" size={40} />
            <div className="flex flex-wrap items-center mb-3 mr-2">
              <div className="w-full sm:w-1/2 lg:w-auto mb-2 sm:mb-0 mr-2 ml-2">
                <label
                  htmlFor="module"
                  className="font-bold block sm:inline-block mb-2 sm:mb-0 mr-2"
                  data-cy="stageLabel"
                >
                  Tracking Stage
                </label>
                <div>
                  <Select
                    onChange={(option) => handleSelectChange(option)}
                    options={parts}
                    value={
                      parts.includes(selectedOption)
                        ? selectedOption
                        : { value: "", label: "" }
                    } // Control the displayed value
                    id="parts"
                    className="react-select-container w-full dark:text-black"
                    styles={{
                      control: (provided: any) => ({
                        ...provided,
                        width: "100%",
                        minWidth: "20rem",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              className="bg-gray-200 text-black h-10 mt-2 rounded w-1/2 min-w-[5rem] max-w-[10rem]"
              onClick={handleReset}
              data-cy="resetFilter"
            >
              Reset Filter
            </button>
          </div>
        </div>
        <div>
          {filteredAssessments.length > 0 ? (
            <div className="bg-white dark:bg-darkmode p-4">
              {filteredAssessments.map((assessment) => (
                <AssessmentTile key={assessment.id} assessment={assessment} />
              ))}
            </div>
          ) : (
            <div
              className="text-center dark:text-white"
              data-cy="filterMessage"
            >
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
