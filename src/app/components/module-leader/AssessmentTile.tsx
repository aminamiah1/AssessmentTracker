// Import necessary modules and components from React
import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { AssessmentOverallProgress } from "@/app/components/trackingProgress/AssessmentOverallProgress";
// Import interfaces from interfaces.ts
import { AssessmentTiles, Assignee } from "@/app/types/interfaces";
import { addQueryParams } from "@/app/utils/checkProformaLink";

// Functional component for rendering an assessment tile
const AssessmentTile = ({ assessment }: { assessment: AssessmentTiles }) => {
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
    <div className="mb-2 dark:text-white grid h-full">
      <div className="bg-gray-100 shadow-lg rounded-lg dark:bg-gray-700">
        <ToastContainer containerId="assessmentModuleLeaderTile" />
        <div className="p-4 md:p-6 flex-1">
          <div className="md:flex md:items-center flex-1">
            <div className="md:w-1/6 md:mt-0 text-sm mr-[2rem]">
              <div>
                <a
                  className="text-blue-500 hover:text-blue-700 text-sm dark:text-white"
                  href={`/module-leader/assessment-management/create-assessment?id=${assessment.id}`}
                  data-cy="assessmentName"
                >
                  {assessment.assessment_name}
                </a>
              </div>
              <p className="mt-4">
                <span className="text-sm text-gray-700 dark:text-white mb-2">
                  Module: {assessment.module_name} ● Type:{" "}
                  {assessment.assessment_type.replaceAll("_", " ")}
                </span>
                <br />
                <div className="mt-4">
                  <span
                    className="text-sm text-gray-700 dark:text-white"
                    title="In ISO Date https://www.iso.org/iso-8601-date-and-time-format.html"
                  >
                    Hand Out Week:{" "}
                    {format(new Date(assessment.hand_out_week), "yyyy/MM/dd")}
                  </span>
                </div>
                <div className="mt-4">
                  <span
                    className="text-sm text-gray-700 dark:text-white"
                    title="In ISO Date https://www.iso.org/iso-8601-date-and-time-format.html"
                  >
                    Hand In Week:{" "}
                    {format(new Date(assessment.hand_in_week), "yyyy/MM/dd")}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-700 dark:text-white">
                    Setter: {assessment.setter?.name ?? "No setter assigned"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <span className="text-md text-gray-700 dark:text-white">
                    Proforma:
                  </span>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed px-2 py-1"
                    disabled={!assessment.proforma_link}
                  >
                    {assessment.proforma_link ? (
                      <Link href={assessment.proforma_link}>Download</Link>
                    ) : (
                      "Proforma Unavailable"
                    )}
                  </button>
                  {assessment.proforma_link && (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed px-2 py-1"
                      disabled={!assessment.proforma_link}
                    >
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        // Add query params to view the file from the browser
                        href={addQueryParams(assessment.proforma_link, [
                          { key: "web", value: "1" },
                        ])}
                      >
                        View on Web
                      </Link>
                    </button>
                  )}
                </div>
                <div className="mt-4 table-caption text-center w-full">
                  <div className="text-left mb-2">
                    <span className="text-md text-left text-gray-700 dark:text-white">
                      Assessment:
                    </span>
                  </div>
                  <div className="w-full table-caption">
                    <button
                      className="mb-2"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <button className="px-12 py-2 w-full text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 shadow">
                        Delete
                      </button>
                    </button>
                  </div>
                  <div>
                    <Link
                      href={`/module-leader/assessment-management/create-assessment?id=${assessment.id}`}
                      data-cy="editAssessment"
                    >
                      <button className="px-12 py-2 w-full text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 shadow">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              </p>
            </div>
            <div className="md:w-1/2 mt-4 ml-4 md:mt-0 text-center md:flex md:items-center">
              {assessment.assignees.length > 0 ? (
                <div>
                  <h6 className="mb-4 text-sm text-gray-700 dark:text-white">
                    Assignees
                  </h6>
                  {assessment.assignees.map((assignee: Assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center bg-gray-200 dark:bg-gray-600 rounded-md p-2 mb-4"
                    >
                      <FaUserCircle className="mr-2 text-black" size={30} />
                      <span
                        className="text-sm text-black dark:text-black"
                        data-cy="assigneeText"
                      >
                        {assignee.name}
                        {" ● "}
                        {assignee.role.replaceAll("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-white ml-2 text-center">
                  No assignees assigned
                </p>
              )}
            </div>
            <div className="w-full md:mt-0 text-sm text-center">
              {assessment.partSubmissions &&
              assessment.partSubmissions.length > 0 ? (
                <AssessmentOverallProgress
                  partsList={assessment.partSubmissions}
                  handInDate={assessment.hand_in_week}
                />
              ) : (
                <h1
                  className="mt-2 text-sm text-gray-700 dark:text-white text-center"
                  data-cy="trackingFormToBeginStatus"
                >
                  Tracking Process Not Yet Started
                </h1>
              )}
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
