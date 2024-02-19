// Import necessary modules and components from React and React Bootstrap
import React, { useState } from "react";
import { Card, Col, Row, Modal, Button } from "react-bootstrap";
import { format } from "date-fns"; // Importing date formatting function from date-fns library
import Image from "next/image"; // Importing Image component from Next.js
import trashCan from "./assets/trashCan.png"; // Importing trash can icon
import profilePic from "./assets/profilePic.png"; // Importing profile picture icon
import editIcon from "./assets/editIcon.png"; // Importing edit icon
import { toast } from "react-toastify"; // Importing toast notification library
import { ToastContainer } from "react-toastify"; // Importing toast container component
import "react-toastify/dist/ReactToastify.css"; // Importing toast notification styles
import Link from "next/link"; // Importing Link component from Next.js

// Functional component for rendering an assessment tile
const AssessmentTile = ({ assessment }: { assessment: any }) => {
  // State variable for managing the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to handle deletion of an assessment
  const handleDelete = () => {
    try {
      // Extracting the assessment ID
      var id = assessment.id;

      // Sending a DELETE request to the server to delete the assessment
      fetch(`/api/module-leader/delete-assessment?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          if (response.ok) {
            // Displaying a success toast notification and reloading the page on successful deletion
            toast.success("Delete assessment successful!");
            window.location.reload();
          } else {
            // Displaying an error toast notification if deletion fails
            toast.error("Error deleting assessment");
          }
        })
        .catch((error) => {
          // Handling network errors and displaying a toast notification to inform the user
          toast.error("Network error please try again");
        });
    } catch (error) {
      // Displaying an error toast notification if an unexpected error occurs
      toast.error("Error deleting assessment");
    }
  };

  return (
    // Assessment tile layout using Bootstrap grid system
    <Col
      className="grid flex-grow-1 col-12 col-md-6"
      style={{ marginBottom: "1rem" }}
    >
      {/* Container for toast notifications */}
      <ToastContainer />
      {/* Card component for displaying assessment details */}
      <Card style={{ boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)" }}>
        <Card.Body>
          <Row>
            {/* Left side of the card displaying assessment details */}
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
                {/* Link to assessment editing page */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Link
                    href={`/module-leader/assessment-management/create-assessment?id=${assessment.id}`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <a>{assessment.assessment_name}</a>
                    {/* Edit icon */}
                    <Image
                      className="object-cover editAssessment"
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
                {/* Displaying module name, assessment type, due date, and stage */}
                <h6>
                  {assessment.module_name} ● {assessment.assessment_type}
                </h6>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h6 style={{ marginRight: "1rem" }}>
                    Due Date: {format(assessment.hand_in_week, "yyyy-MM-dd")} ●
                    Stage: {0} of 11
                  </h6>
                  {/* Button to open delete confirmation modal */}
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
            {/* Right side of the card displaying assignees */}
            <Col
              xs={12}
              md={4}
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              <h6>Assignees</h6>
              {/* Conditional rendering based on the presence of assignees */}
              {assessment.assignees.length > 0 ? (
                <div>
                  {/* Mapping over assignees and displaying their names */}
                  {assessment.assignees.map((assignee: any) => (
                    <div
                      key={assignee.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "lightgray",
                        padding: "0.3rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {/* Profile picture icon */}
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
                // Displaying a message if no assignees are assigned
                <p style={{ textAlign: "center" }}>No assignees assigned</p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal for confirming assessment deletion */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assessment?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the assessment{" "}
          {" " + assessment.assessment_name}?
        </Modal.Body>
        <Modal.Footer>
          {/* Button to cancel deletion */}
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          {/* Button to confirm deletion */}
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

// Exporting the AssessmentTile component as the default export
export default AssessmentTile;
