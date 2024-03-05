// Import necessary modules and components from React
import React, { useState } from "react";
import { format } from "date-fns";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
// Import interfaces from interfaces.ts
import { AssessmentTiles, Assignee } from "@/app/types/interfaces";

// Functional component for rendering an assessment tile for the ps team
const AssessmentTilePS = ({ assessment }: { assessment: AssessmentTiles }) => {
  return (
    // Assessment tile for ps team layout using grid system
    <div className="flex-grow-1 col-12 md:col-6 mb-4 border border-gray-500">
      <ToastContainer />
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
                <div>
                  <span className="text-sm ml-2">
                    ● Setter: {assessment.setter.name}
                  </span>
                </div>
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
      </div>
    </div>
  );
};

// Exporting the AssessmentTile component as the default export
export default AssessmentTilePS;
