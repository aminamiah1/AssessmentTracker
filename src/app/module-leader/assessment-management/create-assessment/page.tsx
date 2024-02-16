"use client";
import React, { useState, useEffect, FormEvent } from "react";
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

interface Assessment {
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module: [];
  setter_id: number;
  assignees: [];
}

export default function CreateAssessmentModuleLeaders() {
  const [setterId, setSetterId] = useState(1); // Module leader 1 for now

  const [modules, setModules] = useState();

  const [users, setUsers] = useState();

  const [assessment, setAssessment] = useState<Assessment>({
    assessment_name: "",
    assessment_type: "",
    hand_out_week: new Date(2024, 1, 26),
    hand_in_week: new Date(2024, 1, 26),
    module: [],
    setter_id: setterId,
    assignees: [],
  });

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

    fetchModules();

    const fetchAssignees = async () => {
      // Fetch all users to assign
      // Getting response as module leader 1 while waiting for login feature
      const response = await axios.get(`/api/module-leader/get-users`);
      console.log(response.data);
      const processedUsers = response.data.map((user: any) => ({
        value: user.id,
        label: user.name + " ● Roles: " + user.roles,
      }));
      setUsers(processedUsers);
    };

    fetchAssignees();
  }, []);

  const handleTextChange = (event: any) => {
    console.log(assessment);
    setAssessment({
      ...assessment,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (date: any, field: any) => {
    setAssessment({
      ...assessment,
      [field]: date,
    });
  };

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
      return; // Prevent form submission
    }

    // Get the selected assignees from the drop-down multi-selector
    const selectedAssigneesValues = new Set(
      assessment.assignees.map((assignee) => assignee["value"]),
    );

    // Create the assessment using the api endpoint
    const response = await fetch("/api/module-leader/create-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessment_name: assessment.assessment_name,
        assessment_type: assessment.assessment_type,
        hand_out_week: assessment.hand_in_week,
        hand_in_week: assessment.hand_out_week,
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
    window.location.reload();
  };

  return (
    <Container fluid className="p-4">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={8}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href={"/module-leader/assessment-management"}>
              <Image
                src={arrowReturn}
                alt="return arrow"
                style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
              />
            </Link>
            <h1 className="text-3xl">Create Assessment</h1>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="assessmentName" style={{ marginTop: "1rem" }}>
              <FormLabel>Assessment title:</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter assessment name"
                value={assessment.assessment_name}
                onChange={handleTextChange}
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

            <FormGroup controlId="assessmentType" style={{ marginTop: "1rem" }}>
              <FormLabel>Assessment type: </FormLabel>
              <FormControl
                type="text"
                placeholder="Enter assessment type..."
                name="assessment_type"
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
                    onChange={(date) => handleDateChange(date, "hand_out_week")}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    required
                    className="form-control shadow-none rounded-0"
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
                    onChange={(date) => handleDateChange(date, "hand_in_week")}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    required
                    className="form-control shadow-none rounded-0"
                  />
                </Row>
              </Row>
            </FormGroup>

            <FormGroup controlId="assignees" style={{ marginTop: "1rem" }}>
              <Row>
                <FormLabel>Assignees:</FormLabel>
                <Select
                  // @ts-ignore
                  onChange={(option) => handleSelectChange(option, "assignees")}
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
              type="submit"
              className="btn btn-primary rounded-0"
              style={{ marginTop: "1rem" }}
            >
              Create Assessment
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
