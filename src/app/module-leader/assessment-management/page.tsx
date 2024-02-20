"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthContext from "@/app/utils/authContext";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn

function ManageAssessmentsModuleLeaders() {
  const { data: session, status } = useSession(); // Use useSession to get session and status
  const [isModuleLeader, setIsModuleLeader] = useState(false); // Confirm if the user is a module leader role type

  useEffect(() => {
    if (session != null) {
      // Check here from session.user.roles array if one of the entires is module_leader to set is module leader to true
      const checkRoles = () => {
        const roles = session.user.roles;
        if (roles.includes("module_leader")) {
          // Set the current user as a module leader to true
          setIsModuleLeader(true);
        } else if (roles.includes("module_leader") === false) {
          // Else make them sign in to access the page
          signIn();
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      // If not a authenticated user then make them sign-in
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>; // Show a loading message while checking session status
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>; // This will be briefly shown before the signIn() effect redirects the user
  }

  return (
    <Container fluid className="p-4">
      <ToastContainer />
      <Row>
        <Col
          className="text-center"
          style={{ marginBottom: "2rem", marginTop: "2rem" }}
        >
          <h1 className="text-3xl">Your Assessments</h1>
        </Col>
      </Row>
      <Row
        className="d-flex align-items-center justify-content-center"
        style={{ height: "70vh" }}
      >
        <Col xs="auto" className="mb-2">
          <Link href="/module-leader/assessment-management/create-assessment">
            <Button variant="dark" style={{ height: "20rem", width: "20rem" }}>
              <div>
                <i
                  className="bi bi-newspaper"
                  style={{ fontSize: "10rem" }}
                ></i>
              </div>
              <div>Create Assessment</div>
            </Button>
          </Link>
        </Col>
        <Col xs="auto" className="mb-2">
          <Link href="/module-leader/assessment-management/view-assessments">
            <Button variant="dark" style={{ height: "20rem", width: "20rem" }}>
              <div>
                <i
                  className="bi bi-envelope-paper"
                  style={{ fontSize: "10rem" }}
                ></i>
              </div>
              <div>View Assessments Created</div>
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

const WrappedAssessmentManagement = () => (
  <AuthContext>
    <ManageAssessmentsModuleLeaders />
  </AuthContext>
);

export default WrappedAssessmentManagement;
