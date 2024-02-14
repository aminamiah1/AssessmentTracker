"use client"; 
import React, { useState } from 'react';
import UsersTable from '../../components/ps-team/UsersTable';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CreateUser from '../../components/ps-team/CreateUser';
import { ToastContainer } from 'react-toastify'

export default function ManageUsersPSTeam() {
  // Handle showing the create user form
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);

  const handleCloseCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

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
          <CreateUser onClose={handleCloseCreateUserForm} />
        </Col>
      </Row>
    </Container>
  );
}