"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import AssessmentTilePS from "../../components/ps-team/AssessmentTilePS";
import AuthContext from "@/app/utils/authContext";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signInn
import { FiFilter } from "react-icons/fi";
import { FiSearch } from "react-icons/fi"; // Search icon
import Select from "react-select";
import { Assessment_type } from "@prisma/client";

interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_id: number;
  module: [];
  setter_id: number;
  setter: { name: string };
  module_name: string;
  assignees: [];
}
interface Module {
  id: number;
  module_name: string;
}
interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roles: [];
}
function ViewAssessmentsPSTeam() {
  const [assessments, setAssessments] = useState<Assessment[]>([]); // Variable to hold an array of assessment object types
  const [searchTerm, setSearchTerm] = useState(""); // Set the search term to blank for default
  const [isPSTeam, setIsPSTeam] = useState(false); // Confirm if the user is a ps team role type
  const { data: session, status } = useSession(); // Use useSession to get session and status
  const [modules, setModules] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const typesOptionsSet = new Set(Object.values(Assessment_type));
  const typesOptionsForSelect = Array.from(typesOptionsSet).map(
    (type: string) => ({
      value: type,
      label: type.replaceAll("_", " "),
    }),
  );
  const [types, setTypes] = useState(typesOptionsForSelect); // Set the assessment types option for the filter box
  const [selectedOption, setSelectedOption] = useState({
    value: "",
    label: "",
  }); // Variable to hold the current selected option

  //Make sure to set the selected option to blank if search term is not a option in any of the select boxes
  useEffect(() => {
    if (searchTerm != selectedOption.value.replaceAll("_", " ")) {
      setSelectedOption({ value: searchTerm, label: searchTerm });
    }
  }, [searchTerm]);

  useEffect(() => {
    if (session != null) {
      // Check here from session.user.roles array if one of the entires is ps_team to set is ps team to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("ps_team")) {
          // Set the current user as a ps team member to true
          setIsPSTeam(true);
        } else if (roles.includes("ps_team") === false) {
          setIsPSTeam(false);
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchAssessments = async () => {
      // Fetch assessments only when component mounts
      const response = await axios.get(`/api/ps-team/assessments/get`);
      const sortedAssessments = response.data.sort(
        (a: Assessment, b: Assessment) => a.id - b.id,
      );
      setAssessments(sortedAssessments);
    };

    const fetchModules = async () => {
      // Fetch modules only when component mounts
      const response = await axios.get(`/api/ps-team/modules/get`);
      if (response.data.length > 0) {
        const processedModules = response.data.map((module: Module) => ({
          value: module.module_name,
          label: module.module_name,
        }));
        setModules(processedModules);
      }
    };

    const fetchUsers = async () => {
      // Fetch all users for filtering
      const response = await axios.get(`/api/ps-team/users/get`);
      const processedUsers = response.data.map((user: User) => ({
        value: user.name,
        label: user.name + " ● Roles: " + user.roles,
      }));
      setUsers(processedUsers);
    };

    if (isPSTeam === true) {
      fetchAssessments();
      fetchModules();
      fetchUsers();
    }
  }, [isPSTeam]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle select drop-down changes for the filtering
  // Using any here as the selected option can come in multiple formats
  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption.value != "") {
      setSearchTerm(
        selectedOption ? selectedOption.value.replaceAll("_", " ") : "",
      );
      setSelectedOption(selectedOption);
    }
  };

  // Handle resetting the search term and selected filter option on button click
  const handleReset = () => {
    setSearchTerm(""); // Reset search term
    setSelectedOption({ value: "", label: "" }); // Reset selected option
  };

  // Filter assessments when user searches by assessment name or module name or users assessment is tied to.
  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.assessment_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assessment.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessment_type
        .toLowerCase()
        .includes(searchTerm.toLowerCase().replaceAll(" ", "_")) ||
      (assessment.assignees as { name: string }[]).find(
        (user) => user.name === searchTerm,
      ) ||
      assessment.setter.name.includes(searchTerm),
  );

  if (status === "loading") {
    return <p className="text-white bg-black">Loading...</p>; // Show a loading message while checking session status
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>; // This will be briefly shown before the signIn() effect redirects the user
  }

  if (isPSTeam === false) {
    return (
      <p className="text-white bg-black">
        You are not authorised to view this page...
      </p>
    ); // Alert the current user that they do not have the role privilege to access the current page
  }

  return (
    <main className="bg-white">
      <div className="p-4 bg-white h-screen text-black">
        <ToastContainer />
        <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 className="text-3xl">All Assessments Overview</h1>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-3">
            <FiSearch
              className="mr-2 mb-2"
              size={30}
              style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
            />
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Enter module or assessment name..."
              className="p-2 mb-3 shadow-md border-b-4 border-black w-full text-black"
            />
          </div>
          <div className="flex flex-col min-[1600px]:flex-row items-center mb-3 mr-2">
            <FiFilter className="mr-2" size={40} />
            <div className="flex flex-wrap items-center mb-3 mr-2">
              <div className="w-full sm:w-1/2 lg:w-auto mb-2 sm:mb-0">
                <label
                  htmlFor="module"
                  className="font-bold block sm:inline-block mb-2 sm:mb-0 mr-2"
                >
                  Module
                </label>
                <div className="w-full">
                  <Select
                    onChange={(option) => handleSelectChange(option)}
                    options={modules}
                    value={
                      modules.includes(selectedOption)
                        ? selectedOption
                        : { value: "", label: "" }
                    } // Control the displayed value
                    id="module"
                    className="react-select-container w-full"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: "100%",
                        minWidth: "20rem",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col min-[1600px]:flex-row items-center mb-3 mr-2">
              <div className="w-full sm:w-1/2 lg:w-auto mb-2 sm:mb-0">
                <label
                  htmlFor="type"
                  className="font-bold block sm:inline-block mb-2 sm:mb-0 mr-2"
                >
                  Type
                </label>
                <div className="w-full">
                  <Select
                    onChange={(option) => handleSelectChange(option)}
                    options={types}
                    id="type"
                    value={
                      types.includes(selectedOption)
                        ? selectedOption
                        : { value: "", label: "" }
                    } // Control the displayed value
                    className="react-select-container w-full"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: "100%",
                        minWidth: "20rem",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col min-[1600px]:flex-row items-center mb-3 mr-2">
              <div className="w-full sm:w-1/2 lg:w-auto mb-2 sm:mb-0">
                <label
                  htmlFor="setter"
                  className="font-bold block sm:inline-block mb-2 sm:mb-0 mr-2"
                >
                  Setter Or Assignee
                </label>
                <div className="w-full">
                  <Select
                    onChange={(option) => handleSelectChange(option)}
                    options={users}
                    id="setter"
                    value={
                      users.includes(selectedOption)
                        ? selectedOption
                        : { value: "", label: "" }
                    } // Control the displayed value
                    className="react-select-container w-full"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: "100%",
                        minWidth: "20rem",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col min-[1600px]:flex-row items-center mb-3 mr-2">
              <div className="w-full sm:w-1/2 lg:w-auto mb-2 sm:mb-0">
                <div className="w-full">
                  <button
                    className="bg-gray-200 text-black h-10 mt-5 rounded"
                    style={{ width: "100%", minWidth: "20rem" }}
                    onClick={handleReset}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {filteredAssessments.length > 0 ? (
            <div className="pb-20 mb-20">
              {filteredAssessments.map((assessment) => (
                <AssessmentTilePS key={assessment.id} assessment={assessment} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              No assessments found matching the search criteria...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const WrappedViewAssessments = () => (
  <AuthContext>
    <ViewAssessmentsPSTeam />
  </AuthContext>
);

export default WrappedViewAssessments;
