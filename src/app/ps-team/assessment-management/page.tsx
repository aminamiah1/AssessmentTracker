"use client";
import UnauthorizedAccess from "@/app/components/authError";
import { AssessmentTiles, Module, User, Part } from "@/app/types/interfaces";
import uploadCSV from "@/app/utils/uploadCSV";
import { Assessment_type } from "@prisma/client";
import { useSession } from "next-auth/react"; // Import useSession and signInn
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiFilter, FiSearch } from "react-icons/fi";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssessmentTilePS from "../../components/ps-team/AssessmentTilePS";
import Link from "next/link";

export default function ViewAssessmentsPSTeam() {
  const [assessments, setAssessments] = useState<AssessmentTiles[]>([]); // Variable to hold an array of assessment object types
  const [searchTerm, setSearchTerm] = useState(""); // Set the search term to blank for default
  const { data: session, status } = useSession({ required: true }); // Use useSession to get session and status
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
  const [parts, setParts] = useState<{ value: string; label: string }[]>([]); // Parts select array
  let [isPopUpOpen, setIsPopUpOpen] = useState(false); // State to control pop-up
  const [selectedFileName, setSelectedFileName] = useState(""); // State to hold the selected csv file name
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the uploaded csv file
  let [refetch, setRefetch] = useState(0); // State to re-fetch assessments after successful csv upload
  const [startDate, setStartDate] = useState<Date>(new Date()); // State to store the user inputted term start date
  //Hard coded API strings for better readability
  const ASSESSMENTS_API_URL = "/api/ps-team/assessments/get";
  const MODULES_API_URL = "/api/ps-team/modules/get";
  const USERS_API_URL = "/api/ps-team/users/get";

  //Make sure to set the selected option to blank if search term is not a option in any of the select boxes
  useEffect(() => {
    if (searchTerm != selectedOption.value.replaceAll("_", " ")) {
      setSelectedOption({ value: searchTerm, label: searchTerm });
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchAssessments = async () => {
      // Fetch assessments only when component mounts
      const response = await fetch(ASSESSMENTS_API_URL);
      const data = await response.json();
      const sortedAssessments = data.sort(
        (a: AssessmentTiles, b: AssessmentTiles) => a.id - b.id,
      );
      setAssessments(sortedAssessments);
    };

    const fetchModules = async () => {
      // Fetch modules only when component mounts
      const response = await fetch(MODULES_API_URL);
      const data = await response.json();
      if (data.length > 0) {
        const processedModules = data.map((module: Module) => ({
          value: module.module_name,
          label: module.module_name,
        }));
        setModules(processedModules);
      }
    };

    const fetchUsers = async () => {
      // Fetch all users for filtering
      const response = await fetch(USERS_API_URL);
      const data = await response.json();
      const processedUsers = data.map((user: User) => ({
        value: user.name,
        label: user.name + " ● Roles: " + user.roles,
      }));
      setUsers(processedUsers);
    };

    const fetchParts = async () => {
      // Fetch parts only when component mounts
      try {
        const response = await fetch(`/api/module-leader/parts/get`);
        const data = await response.json();
        // Insert the 'Process Not Started' option at the beginning
        const partsForSelect = [
          { value: "Process Not Started", label: "Process Not Started" },
          ...data.map((data: Part) => ({
            value: data.part_title,
            label: data.part_title,
          })),
        ];
        setParts(partsForSelect);
      } catch (e) {
        setParts([]);
      }
    };

    if (status === "authenticated" && isPSTeam) {
      try {
        fetchAssessments();
        fetchModules();
        fetchUsers();
        fetchParts();
      } catch (e) {
        setAssessments([]);
        setModules([]);
        setUsers([]);
      }
    }
  }, [status, refetch]);

  // Set the search term based on select box filter option selected
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
      // @ts-ignore
      // Had to do this due to parts list on assessment retrieved being hard to work with as double nested list format,
      // however optional chaining is used here to prevent issues of part list not being present for an assessment
      ((assessment.partSubmissions as [][])?.[0]?.Part === undefined &&
        selectedOption.value === "Process Not Started") ||
      // @ts-ignore
      // Filter by part title with search term associated
      (assessment.partSubmissions as [][])?.[0]?.Part?.part_title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
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
      assessment.setter?.name.includes(searchTerm),
  );

  //On submit function to send the csv to the helper function for csv data creation
  const handleUploadCSV = async (file: File, startDate: Date) => {
    try {
      // Check file is selected first
      if (!file || !startDate) {
        toast.error(
          "Please make sure to select a valid csv file and start date first.",
        );
        throw new Error("File and start date are required.");
      }

      // Check if the selected file has a ".csv" extension
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error("Please select a valid CSV file. Invalid file format.");
        throw new Error("Invalid file format.");
      }

      // If the file and start date is selected and the file is a valid csv execute the utility function
      await uploadCSV({ file, startDate });

      // Let the user know when the csv has been loaded into the database
      toast.success(
        "Assessments and modules loaded into the database successfully!",
      );
    } catch (e) {
      // Error has occured processing the csv, let the user know to check the format before trying again
      toast.error("Error parsing csv, check format and try again");
    }
  };

  // Handle date changes for the form
  const handleDateChange = (date: Date) => {
    setStartDate(date);
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
    <>
      <main className="bg-white dark:text-white">
        <div className="p-4 bg-white h-screen text-black dark:bg-darkmode">
          <ToastContainer />
          <div
            style={{ marginBottom: "2rem", marginTop: "2rem" }}
            className="dark:text-white"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginRight: "2rem",
              }}
            >
              <h1 className="text-3xl">All Assessments Overview</h1>
              <div className="flex flex-row">
                <Link
                  href="/module-leader/assessment-management/create-assessment"
                  data-cy="create-assessments-button"
                  className="text-white "
                >
                  <button className="bg-gray-600 text-white mt-5 p-2 mr-2 rounded">
                    Create Assessment
                  </button>
                </Link>
                <button
                  className="bg-gray-600 text-white mt-5 p-2 rounded"
                  onClick={() => setIsPopUpOpen(true)}
                  data-cy="importCSVButton"
                >
                  Import CSV
                </button>
              </div>
            </div>
          </div>
          <div className="dark:text-white">
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
                placeholder="Enter module or assessment name or tracking stage..."
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
                      className="react-select-container w-full dark:text-black"
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
                      className="react-select-container w-full dark:text-black"
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
                <div className="flex flex-wrap items-center mt-3 mb-3">
                  <div className="w-full sm:w-1/2 lg:w-auto mb-2 sm:mb-0 ml-2">
                    <label
                      htmlFor="module"
                      className="font-bold block sm:inline-block mb-2 sm:mb-0 mr-2"
                      data-cy="stageLabel"
                    >
                      Tracking Stage
                    </label>
                    <div>
                      <Select
                        onChange={(option) => handleSelectChange(option)}
                        options={parts}
                        value={
                          parts.includes(selectedOption)
                            ? selectedOption
                            : { value: "", label: "" }
                        } // Control the displayed value
                        id="parts"
                        className="react-select-container w-full dark:text-black"
                        styles={{
                          control: (provided: any) => ({
                            ...provided,
                            width: "100%",
                            minWidth: "20rem",
                          }),
                        }}
                      />
                    </div>
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
                      className="react-select-container w-full dark:text-black"
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
                  <div className="w-full flex">
                    <button
                      className="bg-gray-600 text-white h-10 mt-5 rounded w-1/2 min-w-[10rem]"
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
              <div className="pb-5 mb-5 grid grid-cols-2 gap-4 max-[1650px]:grid-cols-1">
                {filteredAssessments.map((assessment) => (
                  <AssessmentTilePS
                    key={assessment.id}
                    assessment={assessment}
                    refetch={refetch}
                    setRefetch={setRefetch}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center dark:text-white">
                No assessments found matching the search criteria...
              </div>
            )}
          </div>
        </div>
      </main>

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          isPopUpOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white p-5 border border-black rounded-lg">
          <p className="mb-4 text-black">Import CSV</p>
          <p className="text-black">
            Please choose a import bulk assessment csv to upload.
          </p>
          <div className="mt-4">
            <input
              type="file"
              accept=".csv"
              data-cy="fileChooser"
              onChange={(e) => {
                const files = e.target?.files;
                if (files) {
                  setSelectedFile(files[0]); // Store the file
                  setSelectedFileName(files[0].name);
                }
              }}
            />{" "}
            {/* Accept only .csv files */}
            {selectedFileName && (
              <p className="text-black mt-4">
                {" "}
                Selected File: {selectedFileName}
              </p>
            )}
            <div className="text-black mb-8 mt-10">
              <a
                href="/ImportAssessments.csv"
                download="/ImportAssessments.csv"
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4"
              >
                Download Example CSV
              </a>
              <div className="mt-10">
                <a
                  href="/images/exampleCSV.png"
                  download="/images/exampleCSV.png"
                  className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Download Example Image
                </a>
              </div>
            </div>
            {selectedFile && (
              <div className="text-black">
                <label htmlFor="termStartDate">
                  University Term Start Date:
                </label>
                <div className="w-full">
                  <DatePicker
                    selected={startDate}
                    onChange={(startDate: Date) => handleDateChange(startDate)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select term start date"
                    required
                    className="form-input mb-4 border border-gray-300 border-b-4 border-black p-4"
                  />
                </div>
              </div>
            )}
            <button
              className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
              data-cy="uploadCSV"
              onClick={async () => {
                if (selectedFile) {
                  // Ensure a file is selected
                  try {
                    await handleUploadCSV(selectedFile, startDate).catch(
                      (error) => {
                        // Let the user know if an error occured when uploading the csv
                        toast.error(
                          "Uploading csv failed, check format matches picture and try again.",
                        );
                      },
                    );
                  } catch (e) {
                    toast.error(
                      "Uploading csv failed, check format matches picture and try again.",
                    );
                  } finally {
                    // Close the pop up and refetch the assessments on completion
                    setIsPopUpOpen(false);
                    setRefetch(refetch + 1);
                  }
                } else {
                  // Let the user know if no file uploaded
                  toast.error("No csv file uploaded.");
                }
              }}
            >
              Upload CSV
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 mt-4"
              onClick={() => {
                setIsPopUpOpen(false); // Close the pop-up
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <UnauthorizedAccess />
  );
}
