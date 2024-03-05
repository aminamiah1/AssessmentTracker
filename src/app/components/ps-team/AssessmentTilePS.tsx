// Import necessary modules and components from React
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Select from "react-select";
import { FaUserCircle } from "react-icons/fa";
import { User } from "@/app/types/interfaces";
import axios from "axios";

// Interface for the assessment model
interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_name: string;
  module: [];
  setter_id: number;
  setter: { id: number; name: string; roles: [] };
  assignees: [];
}

interface AssessmentEdit {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_name: string;
  module: [];
  setter_id: { value: number; label: string };
  setter: { id: number; name: string; roles: [] };
  assignees: { value: number }[] | { value: number; label: string }[];
}

// Interface for the assignees
interface Assignee {
  id: number;
  name: string;
  roles: [];
}

// Functional component for rendering an assessment tile for the ps team
const AssessmentTilePS = ({
  assessment,
  refetch,
  setRefetch,
}: {
  assessment: Assessment;
  refetch: any;
  setRefetch: any;
}) => {
  let [isPopUpOpen, setIsPopUpOpen] = useState(false); // State to control pop-up
  const [users, setUsers] = useState([]); // Variable to hold all assignees of an existing assessment
  // Default assessment object used on create form mode as default
  const [assessmentToEdit, setAssessmentToEdit] = useState<AssessmentEdit>({
    id: assessment.id,
    assessment_name: assessment.assessment_name,
    assessment_type: assessment.assessment_type,
    hand_out_week: assessment.hand_out_week,
    hand_in_week: assessment.hand_in_week,
    module_name: assessment.module_name,
    setter_id: { value: 0, label: "" },
    module: assessment.module,
    setter: assessment.setter,
    assignees: [],
  });
  const [loading, setLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    const fetchUsers = async () => {
      // Fetch all users to assign
      const response = await axios.get(`/api/module-leader/users/get`);
      const processedUsers = response.data.map((user: User) => ({
        value: user.id,
        label: user.name + " ● Roles: " + user.roles,
      }));
      setUsers(processedUsers);
    };

    fetchUsers();

    setLoading(false); // Set loading to false once data is fetched
  }, []); // Get all users in the system and apply to assignees

  useEffect(() => {
    if (isPopUpOpen) {
      if (assessment.setter && assessment.assignees) {
        // Find the default assignees for the assessment and select them in the drop-down selector
        const defaultAssignees = assessment.assignees.map(
          (assignee: Assignee) => ({
            value: assignee.id,
            label: assignee.name + " ● Roles: " + assignee.roles,
          }),
        );

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
    console.log(fieldName);
    console.log(assessmentToEdit);
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
      <div className="flex-grow-1 col-12 md:col-6 mb-4 border border-gray-500">
        <div className="bg-white shadow-md">
          <div className="p-4 md:p-6 border-b-2 border-gray-300">
            <div className="md:flex md:items-center">
              <div className="md:w-2/3">
                <div className="flex items-center">
                  <Link
                    href={`/ps-team/assessment-management/view-assessment?id=${assessment.id}`}
                    className="flex items-center"
                  >
                    <p className="text-blue-500 hover:text-blue-700">
                      {assessment.assessment_name}
                    </p>
                  </Link>
                  {assessment.setter && (
                    <div>
                      <span className="text-sm ml-2">
                        ● Setter: {assessment.setter.name}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-4">
                  <span className="text-sm text-gray-700">
                    {assessment.module_name} ●{" "}
                    {assessment.assessment_type.replaceAll("_", " ")}
                  </span>
                  <br />
                  <span className="text-sm text-gray-700">
                    Due Date: {format(assessment.hand_in_week, "yyyy-MM-dd")} ●
                    Stage: {0} of 11
                  </span>
                </p>
              </div>
              <div className="md:w-1/3 mt-4 md:mt-0">
                <h6 className="mb-2">Assignees</h6>
                {assessment.assignees.length > 0 ? (
                  <div>
                    {assessment.assignees.map((assignee: Assignee) => (
                      <div
                        key={assignee.id}
                        className="flex items-center bg-gray-200 rounded-md p-2 mb-4"
                      >
                        <FaUserCircle className="mr-2 text-black" size={30} />
                        <span className="text-sm" data-cy="assigneeText">
                          {assignee.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h1>No Assignees</h1>
                )}
                <div>
                  <button
                    className="bg-gray-200 text-black h-10 mt-5 rounded p-2"
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
