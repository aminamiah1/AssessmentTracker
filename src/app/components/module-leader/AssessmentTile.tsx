// Import necessary modules and components from React
import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { AssessmentOverallProgress } from "@/app/components/module-leader/AssessmentOverallProgress";

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
  assignees: [];
  partSubmissions: []; // Last part submission associated with assessment
}

// Interface for the assignees
interface Assignee {
  id: number;
  name: string;
  roles: [];
}
// Functional component for rendering an assessment tile
const AssessmentTile = ({ assessment }: { assessment: Assessment }) => {
  // State variable for managing the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to handle deletion of an assessment
  const handleDelete = () => {
    try {
      // Extracting the assessment ID
      var id = assessment.id;

      // Sending a DELETE request to the server to delete the assessment
      fetch(`/api/module-leader/assessment/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          if (response.ok) {
            // Displaying a success toast notification and reloading the page on successful deletion
            toast.success("Delete assessment successful!");
            window.location.reload();
          } else {
            // Displaying an error toast notification if deletion fails
            toast.error("Error deleting assessment");
          }
        })
        .catch((error) => {
          // Handling network errors and displaying a toast notification to inform the user
          toast.error("Network error please try again");
        });
    } catch (error) {
      // Displaying an error toast notification if an unexpected error occurs
      toast.error("Error deleting assessment");
    }
  };

  return (
    // Assessment tile layout using grid system
    <div className="flex-grow-1 col-12 md:col-6 mb-4 border border-gray-500 dark:text-white">
      <ToastContainer />
      <div className="bg-white shadow-md dark:bg-gray-700">
        <div className="p-4 md:p-6 border-b-2 border-gray-300">
          <div className="md:flex md:items-center">
            <div className="md:w-1/2 md:mt-0  text-xl">
              <div>
                <a
                  className="text-blue-500 hover:text-blue-700 text-xl dark:text-white"
                  href={`/module-leader/assessment-management/create-assessment?id=${assessment.id}`}
                >
                  {assessment.assessment_name}
                </a>
              </div>
              <p className="mt-4">
                <span className="text-xl text-gray-700 dark:text-white mb-2">
                  {assessment.module_name} ●{" "}
                  {assessment.assessment_type.replaceAll("_", " ")}
                </span>
                <br />
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
                      <span className="text-xl text-black dark:text-black">
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
            <div className="md:w-1/4 md:mt-0 text-center">
              <button
                className="mr-10"
                onClick={() => setShowDeleteModal(true)}
              >
                <FaTrash size={60} className="cursor-pointer" />
              </button>
              <button onClick={() => setShowDeleteModal(true)}>
                <FaEdit size={60} className="cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          showDeleteModal ? "block" : "hidden"
        }`}
      >
        {assessment && (
          <div className="bg-white p-5 border border-black rounded-lg">
            <p className="text-black mb-4">Delete Assessment?</p>
            <p className="text-black mb-4">
              Are you sure you want to delete the assessment:{" "}
              {assessment.assessment_name}?
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Exporting the AssessmentTile component as the default export
export default AssessmentTile;
