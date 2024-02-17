import React, { useState } from "react";
import { Card, Col, Row, Modal, Button } from "react-bootstrap";
import { format } from "date-fns";
import Image from "next/image";
import trashCan from "./assets/trashCan.png";
import profilePic from "./assets/profilePic.png";
import editIcon from "./assets/editIcon.png";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const AssessmentTile = ({ assessment }: { assessment: any }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    // Delete assessment logic
    try {
      var id = assessment.id;

      fetch(`/api/module-leader/delete-assessment?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          if (response.ok) {
            // Handle successful deletion and re-load the assessment viewing page to reflect changes
            toast.success("Delete assessment successful!");
            window.location.reload();
          } else {
            // Handle errors with toast message to inform user
            toast.error("'Error deleting assessment");
          }
        })
        .catch((error) => {
          // Handle network errors with toast to inform user
          console.log(error);
          toast.error("Network error please try again");
        });
    } catch (error) {
      // Display an error message to the assessment with toast message
      toast.error("Error deleting assessment");
    }
  };

  return (
    <Col
      className="grid flex-grow-1 col-12 col-md-6"
      style={{ marginBottom: "1rem" }}
    >
      <ToastContainer />
      <Card style={{ boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)" }}>
        <Card.Body>
          <Row>
            <Col
              xs={12}
              md={8}
              style={{
                borderRight: "2px solid #ddd",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Card.Title>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Link
                    href={`/module-leader/assessment-management/create-assessment?id=${assessment.id}`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <a>{assessment.assessment_name}</a>
                    <Image
                      className="object-cover"
                      src={editIcon}
                      alt="edit icon"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        marginLeft: "1rem",
                      }}
                    />
                  </Link>
                </div>
              </Card.Title>
              <Card.Text>
                <br />
                <h6>
                  {assessment.module_name} ● {assessment.assessment_type}
                </h6>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h6 style={{ marginRight: "1rem" }}>
                    Due Date: {format(assessment.hand_in_week, "yyyy-MM-dd")} ●
                    Stage: {0} of 11
                  </h6>
                  <button onClick={() => setShowDeleteModal(true)}>
                    <Image
                      className="object-cover"
                      src={trashCan}
                      alt="trash can delete"
                      style={{ height: "2rem", width: "2rem" }}
                    />
                  </button>
                </div>
              </Card.Text>
            </Col>
            <Col
              xs={12}
              md={4}
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              <h6>Assignees</h6>
              {assessment.assignees.length > 0 ? (
                // If there are assignees, render them
                <div>
                  {assessment.assignees.map((assignee: any) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "lightgray",
                        padding: "0.3rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <Image
                        src={profilePic}
                        alt="Trash Can"
                        style={{
                          height: "2rem",
                          width: "2rem",
                          marginRight: "1rem",
                        }}
                      />
                      <h6 key={assignee.id}>{assignee.name}</h6>
                    </div>
                  ))}
                </div>
              ) : (
                // If there are no assignees, display a message
                <p style={{ textAlign: "center" }}>No assignees assigned</p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assessment?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the assessment "
          {assessment.assessment_name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

export default AssessmentTile;
