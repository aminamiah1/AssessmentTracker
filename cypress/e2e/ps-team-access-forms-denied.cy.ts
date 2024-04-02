/// <reference types='cypress' />
describe("Admin module list assessment management interactions denied if not right role", () => {
  beforeEach(() => {
    cy.login("internal@test.net");
  });

  it("should not allow assessment edit form to be accessed if not right role", () => {
    cy.visit("module-leader/assessment-management/create-assessment?id=2");
    cy.getByTestId("unauthorizedText").should(
      "have.text",
      "You are not authorised to view this",
    );
  });

  it("should not allow assessment creation form to be accessed if not right role", () => {
    cy.visit("module-leader/assessment-management/create-assessment");
    cy.getByTestId("unauthorizedText").should(
      "have.text",
      "You are not authorised to view this",
    );
  });
});
