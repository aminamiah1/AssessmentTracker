"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import UsersTable from "../../components/ps-team/UsersTable";
import { Container, Row, Col, Button } from "react-bootstrap";
import CreateUser from "../../components/ps-team/CreateUser";
import { ToastContainer } from "react-toastify";
import AuthContext from "@/app/utils/authContext";
import UnauthorizedAccess from "@/app/components/authError";

function ManageUsersPSTeam() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [isPSTeam, setIsPSTeam] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session != null) {
      const checkRoles = () => {
        const roles = session.user.roles;
        console.log(session.user.roles);
        if (roles.includes("ps_team")) {
          setIsPSTeam(true);
        } else {
          setIsPSTeam(false);
          // Set to false if not part of ps_team
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      // If not a authenticated user then make them sign-in
      signIn();
    }
  }, [session, status]);

  const handleCloseCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

  // Render the user management interface if authenticated
  return isPSTeam ? (
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
  ) : (
    <UnauthorizedAccess />
  );
}

const WrappedManageUsersPSTeam = () => (
  <AuthContext>
    <ManageUsersPSTeam />
  </AuthContext>
);

export default WrappedManageUsersPSTeam;
