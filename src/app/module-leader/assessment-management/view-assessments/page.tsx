"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Assessment {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_id: number;
  assignees: [];
}

export default function ViewAssessmentsModuleLeaders() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      // Fetch assessments only when component mounts
      const response = await axios.get("/api/module-leader/get-assessments");
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
      <Row>
        <Col className="text-center">
          <h1 className="text-3xl">Your Assessments Overview</h1>
          {assessments.length > 0 && <h1>{assessments[0].assessment_name}</h1>}
        </Col>
      </Row>
    </Container>
  );
}
