"use client";
import React, { useState, useEffect } from "react";
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

interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_id: number;
  module_name: string;
  setter_id: number;
  assignees: [];
}

export default function CreateAssessmentModuleLeaders() {
  const [setterId, setSetterId] = useState(1); // Module leader 1 for now

  const [modules, setModules] = useState();

  const [users, setUsers] = useState();

  const [assessment, setAssessment] = useState<Assessment>({
    id: 0,
    assessment_name: "",
    assessment_type: "",
    hand_out_week: new Date(2024, 1, 26),
    hand_in_week: new Date(2024, 1, 26),
    module_id: 0,
    module_name: "",
    setter_id: 0,
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
      console.log(response);
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // To add
  };

  return (
    <Container fluid className="p-4">
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

          <Form>
            <FormGroup controlId="assessmentName" style={{ marginTop: "1rem" }}>
              <FormLabel>Assessment title:</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter assessment name"
                value={assessment.assessment_name}
                onChange={handleChange}
                required
                className="form-control shadow-none rounded-0"
              />
            </FormGroup>

            <FormGroup controlId="module" style={{ marginTop: "1rem" }}>
              <Row>
                <FormLabel>Module:</FormLabel>
                <Select
                  // @ts-ignore
                  options={modules}
                  data-cy="module"
                  id="module"
                  value={assessment.module_id}
                  className="react-select-container"
                />
              </Row>
            </FormGroup>

            <FormGroup controlId="assessmentType" style={{ marginTop: "1rem" }}>
              <FormLabel>Assessment type: </FormLabel>
              <FormControl
                type="text"
                placeholder="Enter assessment type..."
                value={assessment.assessment_type}
                onChange={handleChange}
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
                    onChange={(date: Date) => {
                      const d = new Date(date).toLocaleDateString("fr-FR");
                      console.log(d);
                    }}
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
                    onChange={(date: Date) => {
                      const d = new Date(date).toLocaleDateString("en-EN");
                      console.log(d);
                    }}
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
