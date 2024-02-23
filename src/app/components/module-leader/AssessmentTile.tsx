// Import necessary modules and components from React and React Bootstrap
import React, { useState } from "react";
import { format } from "date-fns"; // Importing date formatting function from date-fns library
import Image from "next/image"; // Importing Image component from Next.js
import trashCan from "./assets/trashCan.png"; // Importing trash can icon
import profilePic from "./assets/profilePic.png"; // Importing profile picture icon
import editIcon from "./assets/editIcon.png"; // Importing edit icon
import { toast } from "react-toastify"; // Importing toast notification library
import { ToastContainer } from "react-toastify"; // Importing toast container component
import "react-toastify/dist/ReactToastify.css"; // Importing toast notification styles
import Link from "next/link"; // Importing Link component from Next.js

// Functional component for rendering an assessment tile
const AssessmentTile = ({ assessment }: { assessment: any }) => {
  // State variable for managing the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to handle deletion of an assessment
  const handleDelete = () => {
    try {
      // Extracting the assessment ID
      var id = assessment.id;

      // Sending a DELETE request to the server to delete the assessment
      fetch(`/api/module-leader/delete-assessment?id=${id}`, {
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
    // Assessment tile layout using Bootstrap grid system
    <div className="flex-grow-1 col-12 md:col-6 mb-4 border border-gray-500">
      <ToastContainer />
      <div className="bg-white shadow-md">
        <div className="p-4 md:p-6 border-b-2 border-gray-300">
          <div className="md:flex md:items-center">
            <div className="md:w-2/3">
              <div className="flex items-center">
                <Link
                  href={`/module-leader/assessment-management/create-assessment?id=${assessment.id}`}
                  className="flex items-center"
                >
                  <a className="text-blue-500 hover:text-blue-700">
                    {assessment.assessment_name}
                  </a>
                  <Image
                    className="object-cover editAssessment ml-4"
                    src={editIcon}
                    alt="edit icon"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>
              <p className="mt-4">
                <span className="text-sm text-gray-700">
                  {assessment.module_name} ● {assessment.assessment_type}
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
                  {assessment.assignees.map((assignee: any) => (
                    <div
                      key={assignee.id}
                      className="flex items-center bg-gray-200 rounded-md p-2 mb-4"
                    >
                      <Image
                        src={profilePic}
                        alt="Profile Pic"
                        width={32}
                        height={32}
                        className="mr-2"
                      />
                      <span className="text-sm">{assignee.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No assignees assigned
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6 flex justify-between">
          <button onClick={() => setShowDeleteModal(true)}>
            <Image
              src={trashCan}
              alt="trash can delete"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          </button>
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
