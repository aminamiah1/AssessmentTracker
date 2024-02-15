import React from "react";
import { Card, Col } from "react-bootstrap";
import { format } from "date-fns";

const AssessmentTile = ({ assessment }: { assessment: any }) => {
  return (
    <Col className="grid flex-grow-1 col-12 col-md-6">
      <Card>
        <Card.Body>
          <Card.Title>{assessment.assessment_name}</Card.Title>
          <Card.Text>
            <p>Type: {assessment.assessment_type}</p>
            <p>
              Hand Out Week: {format(assessment.hand_out_week, "yyyy-MM-dd")}
            </p>
            <p>Hand In Week: {format(assessment.hand_in_week, "yyyy-MM-dd")}</p>
            {assessment.module && (
              <p>Module: {assessment.module.module_name}</p>
            )}
            {assessment.setter && <p>Setter: {assessment.setter.name}</p>}
            <p>Assignees:</p>
            <ul>
              {assessment.assignees.map((assignee: any) => (
                <li key={assignee.id}>{assignee.name}</li>
              ))}
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AssessmentTile;
