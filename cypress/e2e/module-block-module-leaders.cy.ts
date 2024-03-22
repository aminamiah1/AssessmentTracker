/// <reference types='cypress' />
describe("Module leader module list page", () => {
  beforeEach(() => {
    cy.login("leader@test.net");
    cy.visit("/module-leader/module-management");
  });

  it("should display the page title", () => {
    cy.getByTestId("page-title")
      .should("be.visible")
      .and("contain", "My Modules List");
  });

  it("should display the correct data from the database", () => {
    cy.getByTestId("module-card")
      .first()
      .should("contain", "Example Module")
      .and("contain", "CM6127");
  });

  it("should show correct modules when search term is entered", () => {
    cy.getByTestId("search-bar").type("CM6127{enter}");
    cy.getByTestId("module-card")
      .should("contain", "Example Module")
      .and("have.length", 1);
  });
});
