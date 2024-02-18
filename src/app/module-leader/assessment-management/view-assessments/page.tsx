"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AssessmentTile from "../../../components/module-leader/AssessmentTile";
import arrowReturn from "../../../components/module-leader/assets/arrowReturn.png";
import Image from "next/image";
import Link from "next/link";

interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_id: number;
  module_name: string;
  assignees: [];
}

export default function ViewAssessmentsModuleLeaders() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [setterId, setSetterId] = useState(1); // Module leader 1 for now
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAssessments = async () => {
      // Fetch assessments only when component mounts
      // Getting response as module leader 1 while waiting for login feature
      const response = await axios.get(
        `/api/module-leader/get-assessments/?id=${setterId}`,
      );
      const sortedAssessments = response.data.sort(
        (a: any, b: any) => a.id - b.id,
      );
      setAssessments(sortedAssessments);
      console.log(sortedAssessments);
    };
    fetchAssessments();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.assessment_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assessment.module_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container fluid className="p-4">
      <ToastContainer />
      <Col style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href={"/module-leader/assessment-management"}>
            <Image
              src={arrowReturn}
              alt="return arrow"
              style={{ marginRight: "1rem", height: "2rem", width: "auto" }}
            />
          </Link>
          <h1 className="text-3xl">Your Assessments Overview</h1>
        </div>
      </Col>
      <Row>
        <Form.Group
          as={Col}
          controlId="searchBar"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Control
            type="text"
            placeholder="Search by assessment name or module name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>
      </Row>
      <Row>
        {filteredAssessments.length > 0 ? (
          <Row>
            {filteredAssessments.map((assessment) => (
              <AssessmentTile key={assessment.id} assessment={assessment} />
            ))}
          </Row>
        ) : (
          <div className="text-center">
            No assessments found matching the search criteria...
          </div>
        )}
      </Row>
    </Container>
  );
}
