/// <reference types='cypress' />
describe("Module leader module list page", () => {
  beforeEach(() => {
    cy.login("leader3@test.net");
    cy.visit("/admin/module-list");
  });

  it("should display the page title", () => {
    cy.getByTestId("page-title")
      .should("be.visible")
      .and("contain", "My Modules List");
  });

  it("should display the correct data from the database", () => {
    cy.getByTestId("module-card")
      .first()
      .should("contain", "Python Apps 2")
      .and("contain", "CM6133");
  });

  it("should show correct modules when search term is entered", () => {
    cy.getByTestId("search-bar").type("CM6133{enter}");
    cy.getByTestId("module-card")
      .should("contain", "Python Apps 2")
      .and("have.length", 1);
  });
});
