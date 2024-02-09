"use client"; 
import React from 'react';
import UsersTable from '../../components/ps-team/UsersTable';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function ManageUsersPSTeam() {
  return (
    <Container fluid className="p-4">
      <Row className="text-center">
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
          <Button variant="success">Add New User</Button>
        </Col>
      </Row>
    </Container>
  );
}