"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { archiveModule } from "@/app/actions/module-status";
import { usePathname } from "next/navigation";
import AssessmentTile from "../../../components/module-leader/AssessmentTile";
import { unwatchFile } from "fs";
import Link from "next/link";
import { AssessmentLoad } from "@/app/types/interfaces";

interface Module {
  module_name: string;
  module_code: string;
  module_leaders: { id: number; name: string; roles: string[] }[];
}

// Code largely adapted from ps team module view page, only changes here to do with making module leader focused
export default function ModuleDetails() {
  const [module, setModule] = useState<Module | null>(null);
  const [assessments, setAssessments] = useState<AssessmentLoad[]>([]);
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
    console.log("Module Code:", moduleCode); // Logging the module code
    if (moduleCode) {
      fetchModuleData(moduleCode);
      fetchAssessments(moduleCode);
    }
  }, [moduleCode]);

  async function fetchModuleData(moduleCode: string) {
    try {
      const res = await fetch(`/api/module-leader/modules/${moduleCode}`);
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
      const res = await fetch(`/api/module-leader/assessments/${moduleCode}`);
      if (!res.ok) {
        throw new Error("Failed to fetch assessments");
      }
      const data = await res.json();
      console.log(data);
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
        {assessments.length > 0 ? (
          <div className="pb-20 mb-20">
            {assessments.map((assessment) => (
              <AssessmentTile key={assessment.id} assessment={assessment} />
            ))}
          </div>
        ) : (
          <div className="text-center dark:text-white" data-cy="filterMessage">
            No assessments found matching the search criteria...
          </div>
        )}
      </div>
    </div>
  );
}
