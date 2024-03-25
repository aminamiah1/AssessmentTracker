// Import necessary modules and components from React
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Select from "react-select";
import { FaUserCircle } from "react-icons/fa";
import { AssessmentOverallProgress } from "@/app/components/module-leader/AssessmentOverallProgress";

// Import interfaces from interfaces.ts
import {
  AssessmentTiles,
  Assignee,
  AssessmentEdit,
  User,
} from "@/app/types/interfaces";

// Functional component for rendering an assessment tile for the ps team
const AssessmentTilePS = ({
  assessment,
  refetch,
  setRefetch,
}: {
  assessment: AssessmentTiles;
  refetch: any;
  setRefetch: any;
}) => {
  let [isPopUpOpen, setIsPopUpOpen] = useState(false); // State to control pop-up
  const [users, setUsers] = useState([]); // Variable to hold all assignees of an existing assessment
  // Default assessment object used on create form mode as default
  const [assessmentToEdit, setAssessmentToEdit] = useState<AssessmentEdit>({
    ...assessment,
    setter_id: { value: 0, label: "" },
    assignees: [],
  });
  const [loading, setLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    const fetchUsers = async () => {
      // Fetch all users to assign
      const response = await fetch(`/api/ps-team/users/get`);

      const data = await response.json();

      const processedUsers = data.map((user: User) => ({
        value: user.id,
        label: user.name + " ● Roles: " + user.roles,
      }));

      setUsers(processedUsers);
    };

    try {
      fetchUsers();
    } catch (e) {
      setUsers([]);
    }

    setLoading(false); // Set loading to false once data is fetched
  }, []); // Get all users in the system and apply to assignees

  useEffect(() => {
    if (isPopUpOpen) {
      if (assessment.setter && assessment.assignees) {
        // Find the default assignees for the assessment and select them in the drop-down selector
        const defaultAssignees = assessment.assignees.map((assignee: User) => ({
          value: assignee.id,
          label: assignee.name + " ● Roles: " + assignee.roles,
        }));

        // Find the default setter for the assessment and select them in the drop-down selector
        const defaultSetter = {
          value: assessment.setter.id,
          label:
            assessment.setter.name + " ● Roles: " + assessment.setter.roles,
        };

        setAssessmentToEdit((prevState) => ({
          ...prevState,
          assignees: defaultAssignees,
          setter_id: defaultSetter,
        }));
      }
    }
  }, [isPopUpOpen]);

  // Handle select drop-down changes for the form
  const handleSelectChange = (selectedOption: any, fieldName: any) => {
    setAssessmentToEdit({ ...assessmentToEdit, [fieldName]: selectedOption });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get the selected assignees from the drop-down multi-selector and get only the value property, the database is expecting
    const selectedAssigneesValues = new Set(
      assessmentToEdit.assignees.map((assignee) => assignee["value"]),
    );

    // Convert selected setter value to format database is expecting i.e. the value from the selector box
    const selectedSetterValue = (assessmentToEdit.setter_id as any).value;

    // Update the assessment using the api endpoint
    const response = await fetch("/api/ps-team/assessment/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: assessmentToEdit.id,
        setter_id: selectedSetterValue,
        assigneesList: Array.from(selectedAssigneesValues),
      }),
    });

    // Alert the user if the api response failed
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to add assessment");
    }

    setRefetch(refetch + 1);

    setIsPopUpOpen(false);
  };

  return (
    // Assessment tile for ps team layout using grid system
    <>
      <div className="bg-white shadow-md mb-10 dark:bg-gray-700">
        <div className="p-4 md:p-6 border-b-2 border-gray-300">
          <div className="md:flex md:items-center">
            <div className="md:w-1/2 md:mt-0  text-xl">
              <div>
                <Link
                  href={`/ps-team/assessment-management/view-assessment?id=${assessment.id}`}
                  className="flex items-center"
                >
                  <p
                    className="text-blue-500 hover:text-blue-700 text-xl dark:text-white"
                    data-cy="assessmentName"
                  >
                    {assessment.assessment_name}
                  </p>
                </Link>
              </div>
              <p className="mt-4">
                <span className="text-xl text-gray-700 dark:text-white mb-2">
                  {assessment.module_name} ●{" "}
                  {assessment.assessment_type.replaceAll("_", " ")}
                </span>
                <br />
                <div className="mt-4">
                  <span className="text-xl text-gray-700 dark:text-white">
                    Setter: {assessment.setter?.name ?? "no setter assigned"}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-xl text-gray-700 dark:text-white">
                    Due Date: {format(assessment.hand_in_week, "yyyy-MM-dd")}
                  </span>
                </div>
              </p>
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
              <h6 className="mb-4 text-xl text-gray-700 dark:text-white">
                Assignees
              </h6>
              {assessment.assignees.length > 0 ? (
                <div>
                  {assessment.assignees.map((assignee: Assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center bg-gray-200 rounded-md p-2 mb-4"
                    >
                      <FaUserCircle className="mr-2 text-black" size={30} />
                      <span
                        className="text-xl text-black dark:text-black"
                        data-cy="assigneeText"
                      >
                        {assignee.name}{" "}
                        {assignee.roles.map(
                          (role: string) => " ● " + role.replaceAll("_", " "),
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xl text-gray-700 dark:text-white">
                  No assignees assigned
                </p>
              )}
            </div>
            <div className="md:w-1/2 md:mt-0 text-center">
              {assessment.partSubmissions &&
              assessment.partSubmissions.length > 0 ? (
                <AssessmentOverallProgress
                  partsList={assessment.partSubmissions}
                />
              ) : (
                <h1
                  className="mt-2 text-xl text-gray-700 dark:text-white text-center"
                  data-cy="trackingFormToBeginStatus"
                >
                  Tracking Process Not Yet Started
                </h1>
              )}
            </div>
            <div className="md:w-1/4 md:mt-0 text-center rounded">
              <button
                className="bg-gray-200 text-black h-20 mt-5 rounded p-3 text-xl"
                data-cy="assignUsers"
                onClick={() => {
                  setIsPopUpOpen(true); // Open the pop-up
                }}
              >
                Assign assignees/setter?
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          isPopUpOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white p-5 border border-black rounded-lg">
          <p className="mb-8">Assign assignees/setter to assessment</p>
          <div>
            <form className="text-black" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="assessmentName" className="font-bold">
                  Assessment Setter
                </label>
                <Select
                  id="setter"
                  options={users}
                  required
                  value={assessmentToEdit.setter_id}
                  onChange={(option) => handleSelectChange(option, "setter_id")}
                  className="react-select-container mb-6"
                />
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  type="text"
                  value={assessmentToEdit.setter_id.label.toString()}
                  required
                  id="setter-input-validation"
                  style={{
                    opacity: 0,
                    height: "0.1rem",
                    margin: 0,
                    padding: 0,
                  }}
                />
              </div>
              <div className="mb-8">
                <label htmlFor="assignees" className="font-bold">
                  Assignees
                </label>
                <div className="mb-4">
                  <Select
                    id="assignees"
                    options={users}
                    onChange={(option) =>
                      handleSelectChange(option, "assignees")
                    }
                    value={assessmentToEdit.assignees}
                    isMulti
                    required
                    className="react-select-container mb-6"
                  />
                </div>
              </div>
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 mt-4"
                type="submit"
              >
                Submit
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 mt-4"
                onClick={() => {
                  setIsPopUpOpen(false); // Close the pop-up
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

// Exporting the AssessmentTile component as the default export
export default AssessmentTilePS;
