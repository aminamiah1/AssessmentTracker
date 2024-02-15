import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { format } from "date-fns";
import Image from "next/image";
import trashCan from "./assets/trashCan.png";
import profilePic from "./assets/profilePic.png";

const AssessmentTile = ({ assessment }: { assessment: any }) => {
  return (
    <Col
      className="grid flex-grow-1 col-12 col-md-6"
      style={{ marginBottom: "1rem" }}
    >
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
                <a href="">{assessment.assessment_name}</a>
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
                  <button>
                    <Image
                      className="object-cover"
                      src={trashCan}
                      alt="Trash Can"
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
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AssessmentTile;
