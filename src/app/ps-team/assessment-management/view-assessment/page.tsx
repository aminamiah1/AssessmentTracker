// Import used libraries
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn
import { ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiArrowLeft } from "react-icons/fi"; // Return arrow icon
import Link from "next/link";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import AuthContext from "@/app/utils/authContext";

// Interface for the assessment model
interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string; // Assessment type is taken from the prisma enum
  hand_out_week: Date;
  hand_in_week: Date;
  module: { module_name: string }; // Allow the react select format to also be used for the module
  assignees: { value: number }[] | { value: number; label: string }[]; // Allow the react select format to also be used for the assignees
}

// Interface for the user model
interface User {
  id: number;
  email: string;
  name: string;
  roles: [];
}

function ViewAssessmentPSTeam() {
  const [isPSTeam, setIsPSTeam] = useState(false); // Confirm if the user is a ps team role type

  const [loading, setLoading] = useState(true); // Initialize loading state to true

  const searchParams = useSearchParams(); // Create search params object

  const [assignees, setAssignees] = useState([]); // Variable to hold all assignees of an existing assessment

  const { data: session, status } = useSession(); // Use useSession to get session and status

  const params = searchParams?.get("id"); // Get the id of the assessment from the search params object

  // Default assessment object used on create form mode as default
  const [assessment, setAssessment] = useState<Assessment>({
    id: 0,
    assessment_name: "",
    assessment_type: "",
    hand_out_week: new Date(2024, 1, 26),
    hand_in_week: new Date(2024, 1, 26),
    module: { module_name: "" },
    assignees: [],
  });

  useEffect(() => {
    if (session != null) {
      //Check here from session.user.roles array if one of the entires is ps_team to set is ps team to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("ps_team")) {
          setIsPSTeam(true);
        } else {
          // Else display unauthorised message
          setIsPSTeam(false);
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    // Fetch the assessment data
    const fetchAssessmentData = async (params: string) => {
      // Fetch the assessment with the id provided in the search param
      fetch(`/api/ps-team/assessment/get?id=${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Parse the JSON response
            return response.json();
          } else {
            // Handle errors with toast message to inform user
            toast.error("Error getting assessment data");
            throw new Error("Error getting assessment data");
          }
        })
        .then((data) => {
          // Set assessment with received data
          const {
            id,
            assessment_name,
            assessment_type,
            hand_out_week,
            hand_in_week,
            setterId,
            module,
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
            module,
          }));

          // Set the data to be manipulated in the effect hook to work with react select boxes
          setAssignees(data.assignees);
        })
        .catch((error) => {
          // Handle network errors with toast to inform user
          toast.error("Network error please try again");
        });
    };

    //Check if there are params
    if (params && isPSTeam === true) {
      fetchAssessmentData(params);
    }
  }, [isPSTeam]);

  useEffect(() => {
    // This effect runs when the  assignees state is updated for assessment
    if (assignees) {
      // Find the default assignees for the assessment and select them in the drop-down selector
      const defaultAssignees = assignees.map((user: User) => ({
        value: user.id,
        label:
          user.name + " ● Roles: " + user.roles.map((role) => " ● " + role),
      }));

      setAssessment((prevState) => ({
        ...prevState,
        assignees: defaultAssignees,
      }));
    }

    setLoading(false); // Set loading to false once data is fetched
  }, [assignees]); // Runs after assignees fetched

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
    <div className="p-4 bg-white h-screen text-black mt-4">
      <ToastContainer />
      {loading ? (
        <div>Loading form...</div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-4">
            <Link href={"/ps-team/assessment-management"}>
              <FiArrowLeft
                className="cursor-pointer"
                size={30}
                style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
              />
            </Link>
            <h1 className="text-3xl ml-2">
              Viewing Assessment: {assessment.assessment_name}
            </h1>
          </div>

          <form className="text-black">
            <div className="mb-4">
              <label htmlFor="assessmentName" className="font-bold">
                Assessment Title
              </label>
              <input
                type="text"
                id="assessmentName"
                value={assessment.assessment_name}
                name="assessment_name"
                data-cy="name"
                required
                disabled
                className="form-input w-full mb-4 border border-gray-300 p-4 border-b-4 border-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="module" className="font-bold">
                Module Name
              </label>
              <div className="w-full mb-6">
                <input
                  type="text"
                  id="assessmentModule"
                  value={assessment.module.module_name}
                  name="module_name"
                  data-cy="module_name"
                  required
                  disabled
                  className="form-input w-full mb-4 border border-gray-300 p-4 border-b-4 border-black"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="assessmentType" className="font-bold">
                Assessment Type
              </label>
              <div className="mb-4">
                <input
                  type="text"
                  id="assessmentType"
                  value={assessment.assessment_type.replaceAll("_", " ")}
                  name="assessment_type"
                  data-cy="assessment_type"
                  required
                  disabled
                  className="form-input w-full mb-4 border border-gray-300 p-4 border-b-4 border-black"
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
                  onChange={(date) => date}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  disabled
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
                  onChange={(date) => date}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  disabled
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
                  id="assignees"
                  value={assessment.assignees}
                  isMulti
                  isDisabled={true}
                  className="react-select-container mb-6"
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const WrappedPSTeamViewAssessment = () => (
  <AuthContext>
    <Suspense>
      <ViewAssessmentPSTeam />
    </Suspense>
  </AuthContext>
);

export default WrappedPSTeamViewAssessment;
