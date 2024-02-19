describe("View All Assessments", () => {
  // Visit the view all assessments page to edit an assessment by clicking the link
  beforeEach(() => {
    cy.visit(
      "http://localhost:3000/module-leader/assessment-management/view-assessments",
    );
  });

  // Edit a new assessment test
  it("allows a module leader to edit an assessment", () => {
    // Edit an assessment through the create new assessment form in edit mode
    cy.get(".editAssessment").eq(1).click({ force: true });
    cy.get('[data-cy="name"]').type("New Assessment");
    cy.get("[id^=react-select-3-input]").type("{enter}{enter}");
    cy.get('[data-cy="type"]').type("Test");
    cy.intercept("POST", "/api/module-leader/edit-assessment", {
      statusCode: 200,
      body: {
        assessment_name: "New Assessment",
        assessment_type: "Test",
      },
    }).as("editAssessment");

    //Return to the assessment management landing page after editing
    cy.get(".arrowReturn").click({ force: true });
  });
});
