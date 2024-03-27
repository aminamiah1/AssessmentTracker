"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { archiveModule } from "@/app/actions/module-status";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AssessmentOverallProgress } from "@/app/components/module-leader/AssessmentOverallProgress";
import { ModulePS, AssessmentPS } from "@/app/types/interfaces";
import { TimeOverallProgress } from "@/app/components/TimeProgressBar/TimeProgressBar";

export default function ModuleDetails() {
  const [module, setModule] = useState<ModulePS | null>(null);
  const [assessments, setAssessments] = useState<AssessmentPS[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  let moduleCode = "";
  //Check path name is not undefined befor continuing
  if (pathname != undefined) {
    let path = pathname.split("/").pop()?.toString();
    if (path != undefined) {
      moduleCode = path;
    }
  } else {
    console.error("Path can not be undefined");
  }

  useEffect(() => {
    if (moduleCode) {
      fetchModuleData(moduleCode);
      fetchAssessments(moduleCode);
    }
  }, [moduleCode]);

  async function fetchModuleData(moduleCode: string) {
    try {
      const res = await fetch(`/api/ps-team/modules/${moduleCode}`);
      if (!res.ok) {
        throw new Error("Failed to fetch module data");
      }
      const data = await res.json();
      setModule(data);
    } catch (error) {
      console.error("Error fetching module data:", error);
      setError("Failed to fetch module data");
    }
  }

  async function fetchAssessments(moduleCode: string) {
    try {
      const res = await fetch(`/api/ps-team/assessments/${moduleCode}`);
      if (!res.ok) {
        throw new Error("Failed to fetch assessments");
      }
      const data = await res.json();
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setError("Failed to fetch assessments");
    }
  }

  async function handleArchiveModule(moduleCode: string) {
    try {
      const res = await archiveModule(moduleCode);
      if (res.error) {
        toast.error(res.error, { position: "bottom-right" });
      } else if (res.success) {
        toast.success(res.success, { position: "bottom-right" });
      }
    } catch (error) {
      console.error("Error archiving module:", error);
      toast.error("Failed to archive module", { position: "bottom-right" });
    }
  }

  if (!module) {
    return <div>Loading module details...</div>;
  }

  const { module_name, module_code, module_leaders } = module;

  return (
    <div className="pt-16 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {module_name}
        </h2>
        <div>
          <Link
            href={`/admin/module-list/edit/${module_code}`}
            className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow inline-block mr-2"
            data-cy="edit-button"
          >
            Edit
          </Link>
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium bg-orange-500 dark:bg-orange-600 text-white rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 shadow"
            onClick={() => handleArchiveModule(module_code)}
            data-cy="archive-button"
          >
            Archive
          </button>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Module Code:{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {module_code}
          </span>
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Module Leaders:
          {module_leaders.map((leader) => (
            <span
              key={leader.id}
              className="ml-2 font-medium text-gray-700 dark:text-gray-200"
            >
              {leader.name}
            </span>
          ))}
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Assessments
          </h3>
          <Link
            href="/some-path-for-create-assessment"
            className="px-6 py-2 text-sm font-medium bg-blue-500 dark:bg-blue-700 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 shadow inline-block"
            data-cy="create-assessments-button"
          >
            Create Assessment
          </Link>
        </div>
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="shadow-lg rounded-lg p-4 mb-4 bg-gray-100 dark:bg-gray-700 text-lg text-gray-900 dark:text-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <strong>{assessment.assessment_name}</strong>
                <p>Type: {assessment.assessment_type}</p>
                <p title="In ISO Date https://www.iso.org/iso-8601-date-and-time-format.html">
                  Hand Out Week:{" "}
                  {format(new Date(assessment.hand_out_week), "yyyy/MM/dd")}
                </p>
                <p title="In ISO Date https://www.iso.org/iso-8601-date-and-time-format.html">
                  Hand In Week:{" "}
                  {format(new Date(assessment.hand_in_week), "yyyy/MM/dd")}
                </p>
                <p>Setter: {assessment.setter?.name ?? "No setter assigned"}</p>
              </div>
              <div className="w-1/3 min-w-max">
                {assessment.hand_in_week && assessment.hand_out_week ? (
                  <TimeOverallProgress
                    handOutDate={assessment.hand_out_week}
                    handInDate={assessment.hand_in_week}
                    partsList={assessment.partSubmissions}
                  />
                ) : (
                  <h1
                    className="mt-2 text-lg text-gray-700 dark:text-white text-center"
                    data-cy="trackingFormToBeginStatus"
                  >
                    No hand in and out weeks assigned
                  </h1>
                )}
              </div>
              <div className="w-1/3 min-w-max">
                {assessment.partSubmissions &&
                assessment.partSubmissions.length > 0 ? (
                  <AssessmentOverallProgress
                    partsList={assessment.partSubmissions}
                  />
                ) : (
                  <div className="text-center p-4">
                    <h1
                      className="text-lg mb-2"
                      data-cy="trackingFormToBeginStatus"
                    >
                      Tracking Process Not Yet Started
                    </h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
