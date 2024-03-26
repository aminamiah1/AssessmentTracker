/// <reference types='cypress' />
describe("Module leader module details page", () => {
  beforeEach(() => {
    cy.login("leader3@test.net");
    cy.visit("/admin/module-list");
  });

  it("should display the correct module information when module name clicked", () => {
    cy.getByTestId("linked-module").first().click();
    cy.getByTestId("assessmentName")
      .first()
      .should("have.text", "Python Fundamentals 2");
  });

  it("can visit create assessment page and go back to modules page", () => {
    cy.getByTestId("linked-module").first().click();
    cy.getByTestId("create-assessments-button").click();
    cy.getByTestId("name").type("New Assessment");
    cy.getByTestId("name").should("have.value", "New Assessment");
    cy.getByTestId("createBackButton").click();
    cy.getByTestId("assessmentName")
      .first()
      .should("have.text", "Python Fundamentals 2");
  });

  it("can visit edit assessment page and go back to modules page", () => {
    cy.getByTestId("linked-module").first().click();
    cy.getByTestId("editAssessment").first().click();
    cy.getByTestId("name").should("have.value", "Python Fundamentals 2");
    cy.getByTestId("createBackButton").click();
    cy.getByTestId("assessmentName")
      .first()
      .should("have.text", "Python Fundamentals 2");
  });
});
