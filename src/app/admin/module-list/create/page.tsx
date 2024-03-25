"use client";

import UnauthorizedAccess from "@/app/components/authError";
import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";

interface ModuleLeader {
  id: string;
  name: string;
}

// interface for the form inputs
interface FormInputs {
  moduleName: string;
  moduleCode: string;
  moduleLeaderName: string[];
}

export default function CreateModule() {
  const [moduleLeaders, setModuleLeaders] = useState<ModuleLeader[]>([]);
  const [formInputs, setFormInputs] = useState<FormInputs>({
    moduleName: "",
    moduleCode: "",
    moduleLeaderName: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession({ required: true });
  const isModuleLeader = session?.user?.roles.includes("module_leader");

  useEffect(() => {
    const fetchModuleLeaders = async () => {
      try {
        const res = await fetch("/api/module-leader/get-module-leaders");
        if (!res.ok) {
          throw new Error("Failed to fetch module leaders");
        }
        const data: ModuleLeader[] = await res.json();
        setModuleLeaders(data);
      } catch (error) {
        console.error("Failed to fetch module leaders", error);
      }
    };

    fetchModuleLeaders();
  }, []);

  // Updates form state handling to accommodate the FormInputs interface
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value,
      );
      setFormInputs((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    const moduleCodePattern = /^[A-Za-z]{2}\d{4}$/;
    e.preventDefault();

    if (!moduleCodePattern.test(formInputs.moduleCode)) {
      setErrorMessage(
        "Module code must be two letters followed by four numbers.",
      );
      setSuccessMessage("");
      return;
    }

    try {
      const res = await fetch("/api/module-list/create-modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInputs),
      });
      if (!res.ok) {
        throw new Error("Failed to create module");
      }
      setSuccessMessage("Module successfully created.");
      setErrorMessage("");
      // Reset form inputs back to initial state
      setFormInputs({
        moduleName: "",
        moduleCode: "",
        moduleLeaderName: [],
      });
    } catch (error) {
      console.error("Failed to create module", error);
      setErrorMessage(
        "Failed to create module. Please check if the Module Name and/or Module Code aren't taken.",
      );
      setSuccessMessage("");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isPSTeam = session.user.roles.includes("ps_team");

  return isPSTeam ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-darkmode">
      <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-lg mx-4">
        {errorMessage && (
          <div className="mb-4 text-center text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-center text-sm text-green-600">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <label
              htmlFor="moduleName"
              className="block text-lg font-semibold text-gray-700"
            >
              Module Name
            </label>
            <input
              type="text"
              name="moduleName"
              value={formInputs.moduleName}
              onChange={handleInputChange}
              placeholder="Enter module name"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-md text-gray-700 placeholder-gray-500"
              required
            />
          </div>
          <div className="text-center">
            <label
              htmlFor="moduleCode"
              className="block text-lg font-semibold text-gray-700"
            >
              Module Code
            </label>
            <input
              type="text"
              name="moduleCode"
              value={formInputs.moduleCode}
              onChange={handleInputChange}
              placeholder="Enter module code"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-md text-gray-700 placeholder-gray-500"
              required
            />
          </div>
          <div className="text-center">
            <label
              htmlFor="moduleLeader"
              className="block text-lg font-semibold text-gray-700"
            >
              Module Leader
            </label>
            <Select
              isMulti
              name="moduleLeaderName"
              options={moduleLeaders.map((leader) => ({
                value: leader.id,
                label: leader.name,
              }))}
              className="basic-multi-select dark:text-black"
              classNamePrefix="select"
              onChange={(selectedOptions) => {
                setFormInputs((prev) => ({
                  ...prev,
                  moduleLeaderName: selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : [],
                }));
              }}
              value={moduleLeaders
                .filter((leader) =>
                  formInputs.moduleLeaderName.includes(leader.id),
                )
                .map((leader) => ({ value: leader.id, label: leader.name }))}
            />
          </div>
          <button
            type="submit"
            className="w-full justify-center py-3 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Module
          </button>
        </form>
      </div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}
