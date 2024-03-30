"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { ModulePS, SelectOption, ModuleLeader } from "@/app/types/interfaces";
import { useParams } from "next/navigation";

const EditModule = () => {
  const params = useParams();
  const moduleId = params.id as string;

  const [moduleDetails, setModuleDetails] = useState<ModulePS | null>(null);
  const [moduleLeaders, setModuleLeaders] = useState<SelectOption[]>([]);
  const [selectedLeaders, setSelectedLeaders] = useState<SelectOption[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!moduleId) return;

      const response = await fetch(`/api/ps-team/module/${moduleId}`);
      if (!response.ok) {
        toast.error("Failed to fetch module details.");
        return;
      }
      const data: ModulePS = await response.json();
      setModuleDetails(data);

      setSelectedLeaders(
        data.module_leaders
          ? data.module_leaders.map((leader) => ({
              value: leader.id.toString(),
              label: leader.name,
            }))
          : [],
      );
    };

    const fetchModuleLeaders = async () => {
      const response = await fetch("/api/module-leader/get-module-leaders");
      if (!response.ok) {
        toast.error("Failed to fetch module leaders.");
        return;
      }
      const leaders: ModuleLeader[] = await response.json();
      setModuleLeaders(
        leaders.map((leader) => ({ value: leader.id, label: leader.name })),
      );
    };

    fetchModuleDetails();
    fetchModuleLeaders();
  }, [moduleId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleDetails || !moduleId) return;

    try {
      const response = await fetch("/api/module-list/edit-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: moduleId,
          moduleName: moduleDetails.module_name,
          moduleCode: moduleDetails.module_code,
          moduleLeaderNames: selectedLeaders.map((leader) => leader.value),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update module");
      }

      setSuccessMessage("Module updated successfully");
      setErrorMessage(null);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating module:", error);

      if (error instanceof Response) {
        try {
          const responseData = await error.json();
          if (responseData.error) {
            setErrorMessage(responseData.error);
          } else {
            setErrorMessage("Failed to update module. Please try again.");
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          setErrorMessage("Failed to update module. Please try again.");
        }
      } else {
        setErrorMessage("Failed to update module. Please try again.");
      }
      setSuccessMessage(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-darkmode">
      <div className="max-w-lg w-full p-4 bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg mb-4">
        <h2 className="text-2xl mb-4">
          Edit Module: {moduleDetails?.module_name}
        </h2>
        {errorMessage && (
          <div className="mb-4 text-center text-red-600">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 text-center text-green-600">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-900 dark:text-gray-200 text-sm font-bold mb-2">
              Module Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              data-cy="module-name"
              value={moduleDetails?.module_name || ""}
              placeholder={moduleDetails?.module_name || "Module Name"}
              onChange={(e) =>
                setModuleDetails({
                  ...moduleDetails,
                  module_name: e.target.value,
                } as ModulePS)
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-900 dark:text-gray-200 text-sm font-bold mb-2">
              Module Code:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              data-cy="module-code"
              value={moduleDetails?.module_code || ""}
              placeholder={moduleDetails?.module_code || "Module Code"}
              onChange={(e) =>
                setModuleDetails({
                  ...moduleDetails,
                  module_code: e.target.value,
                } as ModulePS)
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-900 dark:text-gray-200 text-sm font-bold mb-2">
              Module Leaders:
            </label>
            <Select
              isMulti
              options={moduleLeaders}
              className="basic-multi-select dark:text-black"
              classNamePrefix="select"
              onChange={(options) =>
                setSelectedLeaders(options as SelectOption[])
              }
              value={selectedLeaders}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            data-cy="edit-submit"
          >
            Update Module
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModule;
