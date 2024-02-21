"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import UsersTable from "../../components/ps-team/UsersTable";
import { Container, Row, Col, Button } from "react-bootstrap";
import CreateUser from "../../components/ps-team/CreateUser";
import { ToastContainer } from "react-toastify";
import AuthContext from "@/app/utils/authContext";

function ManageUsersPSTeam() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const handleCloseCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
    // Show a loading message while checking session status
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>;
    // This will be briefly shown before the signIn() effect redirects the user
  }

  const hasRequiredRole = session.user.roles?.includes("ps_team");
  console.log(session.user.roles);

  if (!hasRequiredRole) {
    return <p>You do not have permission to view this page.</p>;
  }

  // Render the user management interface if authenticated
  return (
    <Container fluid className="p-4">
      <ToastContainer />
      <Row>
        <Col>
          <h1 className="text-3xl">User Management</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <UsersTable />
        </Col>
      </Row>
      <Row className="text-center">
        <Col>
          {/* Conditionally render CreateUser based on showCreateUserForm state */}
          {showCreateUserForm && (
            <CreateUser onClose={handleCloseCreateUserForm} />
          )}
          {!showCreateUserForm && (
            <Button onClick={() => setShowCreateUserForm(true)}>
              Create New User
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

const WrappedManageUsersPSTeam = () => (
  <AuthContext>
    <ManageUsersPSTeam />
  </AuthContext>
);

export default WrappedManageUsersPSTeam;
