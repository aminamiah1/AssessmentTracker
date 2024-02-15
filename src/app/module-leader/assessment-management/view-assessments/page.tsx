"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AssessmentTile from "../../../components/module-leader/AssessmentTile";

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

  return (
    <Container fluid className="p-4">
      <ToastContainer />
      <Col style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 className="text-3xl">Your Assessments Overview</h1>
      </Col>
      <Row>
        {assessments.map((assessment) => (
          <AssessmentTile key={assessment.id} assessment={assessment} />
        ))}
      </Row>
    </Container>
  );
}
