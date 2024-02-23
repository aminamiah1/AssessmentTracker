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
import AuthContext from "@/app/utils/authContext";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn

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

function ViewAssessmentsModuleLeaders() {
  const [assessments, setAssessments] = useState<Assessment[]>([]); // Variable to hold an array of assessment object types
  const [setterId, setSetterId] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Set the search term to blank for default
  const [isModuleLeader, setIsModuleLeader] = useState(false); // Confirm if the user is a module leader role type
  const { data: session, status } = useSession(); // Use useSession to get session and status

  useEffect(() => {
    if (session != null) {
      // Check here from session.user.roles array if one of the entires is module_leader to set is module leader to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("module_leader")) {
          // Set the assessment setter id to the current user
          setSetterId(parseInt(session.user.id as any, 10));
          // Set the current user as a module leader to true
          setIsModuleLeader(true);
        } else if (roles.includes("module_leader") === false) {
          setIsModuleLeader(false);
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
      // Getting response as module leader 1 while waiting for login feature
      const response = await axios.get(
        `/api/module-leader/get-assessments/?id=${setterId}`,
      );
      const sortedAssessments = response.data.sort(
        (a: any, b: any) => a.id - b.id,
      );
      setAssessments(sortedAssessments);
    };

    if (isModuleLeader === true && setterId != 0) {
      fetchAssessments();
    }
  }, [isModuleLeader]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter assessments when user searches by assessment name or module name assessment is tied to.
  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.assessment_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assessment.module_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (status === "loading") {
    return <p>Loading...</p>; // Show a loading message while checking session status
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>; // This will be briefly shown before the signIn() effect redirects the user
  }

  if (isModuleLeader === false) {
    return <p>You are not authorised to view this page...</p>; // Alert the current user that they do not have the role privilege to access the current page
  }

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

const WrappedViewAssessments = () => (
  <AuthContext>
    <ViewAssessmentsModuleLeaders />
  </AuthContext>
);

export default WrappedViewAssessments;
