"use client";
import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ManageAssessmentsModuleLeaders() {
  return (
    <Container fluid className="p-4">
      <ToastContainer />
      <Row>
        <Col className="text-center">
          <h1 className="text-3xl">Your Assessments</h1>
        </Col>
      </Row>
      <Row
        className="d-flex align-items-center justify-content-center"
        style={{ height: "80vh" }}
      >
        <Col xs="auto" className="mb-2">
          <Button variant="dark" style={{ height: "20rem", width: "20rem" }}>
            <div>
              <i className="bi bi-newspaper" style={{ fontSize: "10rem" }}></i>
            </div>
            <div>Create Assessment</div>
          </Button>
        </Col>
        <Col xs="auto" className="mb-2">
          <Button variant="dark" style={{ height: "20rem", width: "20rem" }}>
            <div>
              <i
                className="bi bi-envelope-paper"
                style={{ fontSize: "10rem" }}
              ></i>
            </div>
            <div>View Assessments Created</div>
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
