// Import used libraries
"use client";
import React, { useState, useEffect, FormEvent, Suspense } from "react";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn
import { ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiArrowLeft } from "react-icons/fi"; // Return arrow icon
import Link from "next/link";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import AuthContext from "@/app/utils/authContext";
import { Assessment_type } from "@prisma/client";
import UnauthorizedAccess from "@/app/components/authError";
// Import interfaces from interfaces.ts
import { AssessmentForm, Module, User } from "@/app/types/interfaces";

function CreateAssessmentModuleLeaders() {
  const [setterId, setSetterId] = useState(0);

  const [isEdit, setIsEdit] = useState(false); //Check if the form is in edit mode

  const [isModuleLeader, setIsModuleLeader] = useState(false); // Confirm if the user is a module leader role type

  const [loading, setLoading] = useState(true); // Initialize loading state to true

  const [modules, setModules] = useState([]); // Variable to hold all modules in the system

  const [moduleId, setModuleId] = useState(null); // Variable to hold existing assessment module ID

  const [users, setUsers] = useState(); // Variable to hold all users in the system

  const router = useRouter(); // Create next router object

  const [assignees, setAssignees] = useState([]); // Variable to hold all assignees of an existing assessment

  const searchParams = useSearchParams(); // Create search params object

  const { data: session, status } = useSession(); // Use useSession to get session and status

  const params = searchParams?.get("id"); // Get the id of the assessment to edit from the search params object

  // Default assessment object used on create form mode as default
  const [assessment, setAssessment] = useState<AssessmentForm>({
    id: 0,
    assessment_name: "",
    assessment_type: { value: "" },
    hand_out_week: new Date(2024, 1, 26),
    hand_in_week: new Date(2024, 1, 26),
    module: [],
    setter_id: setterId,
    assignees: [],
  });

  const typesOptionsSet = new Set(Object.values(Assessment_type));

  const typesOptionsForSelect = Array.from(typesOptionsSet).map(
    (type: any) => ({
      value: type,
      label: type.replaceAll("_", " "),
    }),
  );

  useEffect(() => {
    if (session != null) {
      //Check here from session.user.roles array if one of the entires is module_leader to set is module leader to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("module_leader")) {
          setIsModuleLeader(true);
          //Set the assessment setter id to the current user
          setSetterId(parseInt(session.user.id as string, 10));
        } else {
          // Else display unauthorised message
          setIsModuleLeader(false);
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchModules = async () => {
      // Fetch modules by setter only when component mounts
      // Getting response as module leader 1 while waiting for login feature
      const response = await fetch(
        `/api/module-leader/modules/get/?id=${setterId}`,
      );
      const data = await response.json();
      if (data.length > 0) {
        const processedModules = data[0].modules.map((module: Module) => ({
          value: module.id,
          label: module.module_name,
        }));
        setModules(processedModules);
      }
    };

    const fetchAssignees = async () => {
      // Fetch all users to assign
      const response = await fetch(`/api/module-leader/users/get`);
      const data = await response.json();
      const processedUsers = data.map((user: User) => ({
        value: user.id,
        label: user.name + " ● Roles: " + user.roles,
      }));
      setUsers(processedUsers);
    };

    // Fetch the assessment to be edited data
    const fetchAssessmentData = async (params: string) => {
      // Fetch the assessment with the id provided in the search param
      fetch(`/api/module-leader/assessment/get?id=${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Parse the JSON response and pass user details
            return response.json();
          } else {
            // Handle errors with toast message to inform user
            toast.error("Error getting user");
            throw new Error("Error getting user");
          }
        })
        .then((data) => {
          // Set assessment to edit state with received data
          const {
            id,
            assessment_name,
            assessment_type,
            hand_out_week,
            hand_in_week,
            setterId,
          } = data;

          // Only set the fields with the types that do not need to be adapted to work with the react select boxes
          setAssessment((prevState) => ({
            ...prevState,
            id,
            assessment_name,
            assessment_type,
            hand_out_week,
            hand_in_week,
            setterId,
          }));

          // Set the data to be manipulated in the effect hook to work with react select boxes
          setModuleId(data.module_id);
          setAssignees(data.assignees);
        })
        .catch((error) => {
          // Handle network errors with toast to inform user
          toast.error("Network error please try again");
        });
    };

    //Check if there are params and change to edit form, if not then continue with create form
    if (params && isModuleLeader === true && setterId != 0) {
      setIsEdit(true);
      fetchAssignees();
      fetchModules();
      fetchAssessmentData(params);
    } else if (isModuleLeader === true && setterId != 0) {
      fetchAssignees();
      fetchModules();
    }

    setLoading(false); // Set loading to false once data is fetched
  }, [isModuleLeader]);

  useEffect(() => {
    // This effect runs when the modules and assignees state is updated on editing assessment
    if (modules && moduleId && isModuleLeader === true && setterId != 0) {
      // Find the default module with moduleId and set it as the default value
      const defaultModule = modules.find(
        (module: any) => module.value === moduleId,
      );

      if (defaultModule) {
        setAssessment((prevState) => ({
          ...prevState,
          module: defaultModule,
        }));
      }

      if (assignees) {
        // Find the default assignees for the assessment and select them in the drop-down selector
        const defaultAssignees = assignees.map((user: User) => ({
          value: user.id,
          label: user.name + " ● Roles: " + user.roles,
        }));
        setAssessment((prevState) => ({
          ...prevState,
          assignees: defaultAssignees,
        }));
      }

      // Populate select box with to be edited assessment type if found
      if (assessment.assessment_type.value != "") {
        const defaultAssessmentType = typesOptionsForSelect.find(
          (type: any) => type.value === assessment.assessment_type,
        );

        if (defaultAssessmentType) {
          setAssessment((prevState) => ({
            ...prevState,
            assessment_type: defaultAssessmentType,
          }));
        }
      }
    }
  }, [modules, moduleId, isModuleLeader]); // Runs if editing the assessment and is a module leader

  // Handle text changes for the form
  const handleTextChange = (event: any) => {
    setAssessment({
      ...assessment,
      [event.target.name]: event.target.value,
    });
  };

  // Handle date changes for the form
  const handleDateChange = (date: any, field: any) => {
    setAssessment({
      ...assessment,
      [field]: date,
    });
  };

  // Handle select drop-down changes for the form
  const handleSelectChange = (selectedOption: any, fieldName: any) => {
    setAssessment({ ...assessment, [fieldName]: selectedOption });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if assignees or modules are empty
    if (assessment.assignees.length === 0 || assessment.module.length === 0) {
      toast.error(
        "Please select at least one asignee or module for the assessment",
      );
      return; // Then prevent form submission
    }

    // Get the selected assignees from the drop-down multi-selector and get only the value property, the database is expecting
    const selectedAssigneesValues = new Set(
      assessment.assignees.map((assignee) => assignee["value"]),
    );

    // Convert selected module value to format database is expecting i.e. the value from the selector box
    const selectedModuleValue = (assessment.module as any).value;

    // Convert selected assessment type value to format database is expecting i.e. the value from the selector box
    const selectedAssessmentTypeValue = (assessment.assessment_type as any)
      .value;

    if (isEdit) {
      // Update the assessment using the api endpoint
      const response = await fetch("/api/module-leader/assessment/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...assessment,
          assessment_type: selectedAssessmentTypeValue,
          module_id: selectedModuleValue,
          setter_id: setterId,
          assigneesList: Array.from(selectedAssigneesValues),
        }),
      });

      // Alert the user if the api response failed
      if (!response.ok) {
        const errorData = await response.text();
        toast.error(
          "Assessment either already exists or incorrect details entered or database server failed, please try again",
        );
        throw new Error(errorData || "Failed to add assessment");
      }

      toast.success("Assessment edited successfully!");
      router.push("/module-leader/assessment-management/view-assessments");
    } else {
      // Create the assessment using the api endpoint
      const response = await fetch("/api/module-leader/assessment/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_name: assessment.assessment_name,
          assessment_type: selectedAssessmentTypeValue,
          hand_out_week: assessment.hand_out_week,
          hand_in_week: assessment.hand_in_week,
          module_id: selectedModuleValue,
          setter_id: setterId,
          assigneesList: Array.from(selectedAssigneesValues),
        }),
      });

      // Alert the user if the api response failed
      if (!response.ok) {
        const errorData = await response.text();
        toast.error(
          "Assessment either already exists or incorrect details entered or database server failed, please try again",
        );
        throw new Error(errorData || "Failed to add assessment");
      }

      toast.success("Assessment added successfully!");
      router.push("/module-leader/assessment-management/view-assessments");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return isModuleLeader ? (
    <div className="bg-white dark:bg-darkmode h-screen max-h-full">
      <ToastContainer />
      {loading ? (
        <div>Loading form...</div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-4">
            <Link href={"/module-leader/assessment-management"}>
              <FiArrowLeft
                className="cursor-pointer"
                size={30}
                style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
              />
            </Link>
            <h1 className="text-3xl ml-2 pt-16 text-center">
              {isEdit ? "Edit Assessment" : "Create Assessment"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="text-black">
            <div className="mb-4">
              <label htmlFor="assessmentName" className="font-bold">
                Assessment Title
              </label>
              <input
                type="text"
                id="assessmentName"
                placeholder="Enter assessment name"
                value={assessment.assessment_name}
                onChange={handleTextChange}
                name="assessment_name"
                data-cy="name"
                required
                className="form-input w-full mb-4 border border-gray-300 p-4 border-b-4 border-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="module" className="font-bold">
                Module
              </label>
              <div className="w-full mb-6">
                <Select
                  onChange={(option) => handleSelectChange(option, "module")}
                  options={modules}
                  id="module"
                  value={assessment.module}
                  className="react-select-container"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="assessmentType" className="font-bold">
                Assessment Type
              </label>
              <div className="mb-4">
                <Select
                  onChange={(option) =>
                    handleSelectChange(option, "assessment_type")
                  }
                  options={typesOptionsForSelect.map((type) => ({
                    ...type,
                    key: type.value,
                  }))}
                  id="assessment_type"
                  name="assessment_type"
                  required
                  data-cy="type"
                  value={assessment.assessment_type}
                  className="react-select-container mb-6"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="handOutWeek" className="font-bold">
                Hand Out Week
              </label>
              <div className="w-full">
                <DatePicker
                  selected={assessment.hand_out_week}
                  onChange={(date) => handleDateChange(date, "hand_out_week")}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  required
                  className="form-input mb-4 border border-gray-300 border-b-4 border-black p-4"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="handInWeek" className="font-bold">
                Hand In Week
              </label>
              <div className="w-full">
                <DatePicker
                  selected={assessment.hand_in_week}
                  onChange={(date) => handleDateChange(date, "hand_in_week")}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  required
                  className="form-input w-full mb-4 border border-gray-300 border-b-4 border-black p-4"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="assignees" className="font-bold">
                Assignees
              </label>
              <div className="mb-4">
                <Select
                  onChange={(option) => handleSelectChange(option, "assignees")}
                  options={users}
                  id="assignees"
                  value={assessment.assignees}
                  isMulti
                  className="react-select-container mb-6"
                />
              </div>
            </div>

            <div className="h-screen">
              <button
                type="submit"
                className="bg-gray-700 hover:bg-azure-700 text-white font-bold rounded w-full py-7"
              >
                {isEdit ? "Edit Assessment" : "Create Assessment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}

const WrappedCreateAssessment = () => (
  <AuthContext>
    <Suspense>
      <CreateAssessmentModuleLeaders />
    </Suspense>
  </AuthContext>
);

export default WrappedCreateAssessment;
