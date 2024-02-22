"use client";
import React, { useState } from "react";
import UsersTable from "../../components/ps-team/UsersTable";
import { Container, Row, Col, Button } from "react-bootstrap";
import CreateUser from "../../components/ps-team/CreateUser";
import { ToastContainer } from "react-toastify";
import styles from "./page.module.css";

export default function ManageUsersPSTeam() {
  // Handle showing the create user form
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);

  const handleCloseCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "whitesmoke", height: "100vh" }}
    >
      <ToastContainer />
      <Row>
        <Col style={{ display: "flex", marginBottom: "2.5rem" }}>
          <h1 className="text-3xl" style={{ fontSize: "xx-large" }}>
            User Management
          </h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <UsersTable />
        </Col>
      </Row>
      <Row className="text-center">
        <Col>
          <CreateUser onClose={handleCloseCreateUserForm} />
        </Col>
      </Row>
    </Container>
  );
}
