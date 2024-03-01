describe("See details of individual assessments on ps team assessment viewing dashboard", () => {
  beforeEach(() => {
    cy.login();
  });

  // Can filter and expect to see only one assessment
  it("allows a ps-team member to view an individual assessment's details on click", () => {
    cy.visit("/ps-team/assessment-management");

    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/users/get", {
      fixture: "users.json",
    }).as("getAssignees");

    // Spoof getting modules by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/modules/get?id=6", {
      fixture: "modules.json",
    }).as("getModules");

    // Spoof getting assessments by retrieving them from example JSON
    cy.intercept("GET", "/api/ps-team/assessments/get", {
      fixture: "assessments.json",
    }).as("getAssessments");

    cy.contains("p", "My new assessment").click();

    // Spoof getting assessments by retrieving them from example JSON
    cy.intercept("GET", "/api/ps-team/assessment/get/id?=3", {
      fixture: "assessment.json",
    }).as("getAssessment");

    cy.contains("label", "Assessment Title")
      .next()
      .should("have.value", "My new assessment");

    // Spoof getting assessments by retrieving them from example JSON
    cy.intercept("GET", "/api/ps-team/assessment/get/id?=3", {
      fixture: "assessment.json",
    }).as("getAssessment");
  });
});
