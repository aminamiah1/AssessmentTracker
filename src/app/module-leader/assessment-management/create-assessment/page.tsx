// Import used libraries
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import arrowReturn from "../../../components/module-leader/assets/arrowReturn.png";
import Image from "next/image";
import Link from "next/link";
import Select from "react-select";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import AuthContext from "@/app/utils/authContext";

// Interface for the assessment model
interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module: [];
  setter_id: number;
  assignees: [];
}

function CreateAssessmentModuleLeaders() {
  const [setterId, setSetterId] = useState(0);

  const [isEdit, setIsEdit] = useState(false); //Check if the form is in edit mode

  const [isModuleLeader, setIsModuleLeader] = useState(false); // Confirm if the user is a module leader role type

  const [loading, setLoading] = useState(true); // Initialize loading state to true

  const [modules, setModules] = useState(); // Variable to hold all modules in the system

  const [moduleId, setModuleId] = useState(null); // Variable to hold existing assessment module ID

  const [users, setUsers] = useState(); // Variable to hold all users in the system

  const router = useRouter(); // Create next router object

  const [assignees, setAssignees] = useState(); // Variable to hold all assignees of an existing assessment

  const searchParams = useSearchParams(); // Create search params object

  const { data: session, status } = useSession(); // Use useSession to get session and status

  // @ts-ignore
  const params = searchParams.get("id"); // Get the id of the assessment to edit from the search params object

  // Default assessment object used on create form mode as default
  const [assessment, setAssessment] = useState<Assessment>({
    id: 0,
    assessment_name: "",
    assessment_type: "",
    hand_out_week: new Date(2024, 1, 26),
    hand_in_week: new Date(2024, 1, 26),
    module: [],
    setter_id: setterId,
    assignees: [],
  });

  useEffect(() => {
    if (session != null) {
      //Check here from session.user.roles array if one of the entires is module_leader to set is module leader to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("module_leader")) {
          setIsModuleLeader(true);
          //Set the assessment setter id to the current user
          setSetterId(parseInt(session.user.id as any, 10));
        } else {
          signIn();
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
      const response = await axios.get(
        `/api/module-leader/get-modules/?id=${setterId}`,
      );
      const processedModules = response.data[0].modules.map((module: any) => ({
        value: module.id,
        label: module.module_name,
      }));
      setModules(processedModules);
    };

    const fetchAssignees = async () => {
      // Fetch all users to assign
      // Getting response as module leader 1 while waiting for login feature
      const response = await axios.get(`/api/module-leader/get-users`);
      const processedUsers = response.data.map((user: any) => ({
        value: user.id,
        label: user.name + " ● Roles: " + user.roles,
      }));
      setUsers(processedUsers);
    };

    // Fetch the assessment to be edited data
    const fetchAssessmentData = async (params: any) => {
      // Fetch the assessment with the id provided in the search param
      fetch(`/api/module-leader/get-assessment?id=${params}`, {
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
          setAssessment((prevState) => ({
            ...prevState,
            id,
            assessment_name,
            assessment_type,
            hand_out_week,
            hand_in_week,
            setterId,
          }));
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
      // @ts-ignore
      const defaultModule = modules.find((module) => module.value === moduleId);
      if (defaultModule) {
        setAssessment((prevState) => ({
          ...prevState,
          module: defaultModule,
        }));
      }

      if (assignees) {
        // Find the default assignees for the assessment and select them in the drop-down selector
        // @ts-ignore
        const defaultAssignees = assignees.map((user: any) => ({
          value: user.id,
          label: user.name + " ● Roles: " + user.roles,
        }));
        setAssessment((prevState) => ({
          ...prevState,
          assignees: defaultAssignees,
        }));
      }
    }
  }, [modules, users, assignees, moduleId, isModuleLeader]); // Runs if editing the assessment and is a module leader

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

    // Get the selected assignees from the drop-down multi-selector
    const selectedAssigneesValues = new Set(
      assessment.assignees.map((assignee) => assignee["value"]),
    );

    if (isEdit) {
      // Update the assessment using the api endpoint
      const response = await fetch("/api/module-leader/edit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: assessment.id,
          assessment_name: assessment.assessment_name,
          assessment_type: assessment.assessment_type,
          hand_out_week: assessment.hand_out_week,
          hand_in_week: assessment.hand_in_week,
          // @ts-ignore
          module_id: assessment.module.value,
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
      const response = await fetch("/api/module-leader/create-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_name: assessment.assessment_name,
          assessment_type: assessment.assessment_type,
          hand_out_week: assessment.hand_out_week,
          hand_in_week: assessment.hand_in_week,
          // @ts-ignore
          module_id: assessment.module.value,
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
    return <p>Loading...</p>; // Show a loading message while checking session status
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>; // This will be briefly shown before the signIn() effect redirects the user
  }

  return (
    <Container fluid className="p-4">
      <ToastContainer />
      {loading ? ( // Conditionally render loading indicator or show the create assessment form
        <div>Loading form...</div>
      ) : (
        <Row className="justify-content-center">
          <Col md={8}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link href={"/module-leader/assessment-management"}>
                <Image
                  src={arrowReturn}
                  className="arrowReturn"
                  alt="return arrow"
                  style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
                />
              </Link>
              <h1 className="text-3xl">
                {" "}
                {isEdit ? "Edit Assessment" : "Create Assessment"}
              </h1>
            </div>

            <Form onSubmit={handleSubmit}>
              <FormGroup
                controlId="assessmentName"
                style={{ marginTop: "1rem" }}
              >
                <FormLabel>Assessment title:</FormLabel>
                <FormControl
                  type="text"
                  placeholder="Enter assessment name"
                  value={assessment.assessment_name}
                  onChange={handleTextChange}
                  data-cy="name"
                  name="assessment_name"
                  required
                  className="form-control shadow-none rounded-0"
                />
              </FormGroup>

              <FormGroup controlId="module" style={{ marginTop: "1rem" }}>
                <Row>
                  <FormLabel>Module:</FormLabel>
                  <Select
                    // @ts-ignore
                    onChange={(option) => handleSelectChange(option, "module")}
                    options={modules}
                    data-cy="module"
                    id="module"
                    value={assessment.module}
                    className="react-select-container"
                  />
                </Row>
              </FormGroup>

              <FormGroup
                controlId="assessmentType"
                style={{ marginTop: "1rem" }}
              >
                <FormLabel>Assessment type: </FormLabel>
                <FormControl
                  type="text"
                  placeholder="Enter assessment type..."
                  name="assessment_type"
                  data-cy="type"
                  value={assessment.assessment_type}
                  onChange={handleTextChange}
                  required
                  className="form-control shadow-none rounded-0"
                />
              </FormGroup>

              <FormGroup controlId="handOutWeek" style={{ marginTop: "1rem" }}>
                <Row>
                  <Row>
                    <FormLabel>Hand out week: </FormLabel>
                  </Row>
                  <Row>
                    <DatePicker
                      selected={assessment.hand_out_week}
                      onChange={(date) =>
                        handleDateChange(date, "hand_out_week")
                      }
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      required
                      className="form-control shadow-none rounded-0"
                      data-cy="handOutDate"
                    />
                  </Row>
                </Row>
              </FormGroup>

              <FormGroup controlId="handInWeek" style={{ marginTop: "1rem" }}>
                <Row>
                  <Row>
                    <FormLabel>Hand in week: </FormLabel>
                  </Row>
                  <Row>
                    <DatePicker
                      selected={assessment.hand_in_week}
                      onChange={(date) =>
                        handleDateChange(date, "hand_in_week")
                      }
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      required
                      className="form-control shadow-none rounded-0"
                      data-cy="handInDate"
                    />
                  </Row>
                </Row>
              </FormGroup>

              <FormGroup controlId="assignees" style={{ marginTop: "1rem" }}>
                <Row>
                  <FormLabel>Assignees:</FormLabel>
                  <Select
                    // @ts-ignore
                    onChange={(option) =>
                      handleSelectChange(option, "assignees")
                    }
                    options={users}
                    data-cy="assignees"
                    id="assignees"
                    value={assessment.assignees}
                    isMulti
                    className="react-select-container"
                  />
                </Row>
              </FormGroup>

              <Button
                variant="primary"
                data-cy="CreateAssessment"
                type="submit"
                className="btn btn-primary rounded-0"
                style={{ marginTop: "1rem" }}
              >
                {isEdit ? "Edit Assessment" : "Create Assessment"}
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
}

const WrappedCreateAssessment = () => (
  <AuthContext>
    <CreateAssessmentModuleLeaders />
  </AuthContext>
);

export default WrappedCreateAssessment;
