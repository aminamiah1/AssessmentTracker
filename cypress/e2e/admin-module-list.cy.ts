/// <reference types='cypress' />
describe("Admin module list page", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/admin/module-list");
  });

  it("should display the page title", () => {
    cy.getByTestId("page-title")
      .should("be.visible")
      .and("contain", "Module List");
  });

  it("should display the correct data from the database", () => {
    cy.getByTestId("module-card")
      .first()
      .should("contain", "Software Engineering")
      .and("contain", "CM3101");
  });

  it("should display the search bar", () => {
    cy.getByTestId("search-bar").should("be.visible");
  });

  it("should show the create module button", () => {
    cy.getByTestId("create-module-btn")
      .should("be.visible")
      .and("contain", "Create Module");
    // Will eventually lead to create module page
  });

  it("should show all module manage buttons", () => {
    cy.getByTestId("archive-button").each((button) => {
      cy.wrap(button).should("exist");
    });

    cy.getByTestId("edit-button").each((button) => {
      cy.wrap(button).should("exist");
    });
    // These buttons will eventually lead to different pages
  });

  it("should show correct modules when search term is entered", () => {
    cy.getByTestId("search-bar").type("CM3101{enter}");
    cy.getByTestId("module-card")
      .should("contain", "Software Engineering")
      .and("have.length", 1);
    // will need to change once testing db is setup
  });

  it("should remove a module from the page when it is archived", () => {
    cy.getByTestId("archive-button").last().click();
    cy.get(".Toastify__toast-body").should("be.visible");
    cy.contains("[data-cy='module-card']", "CM6128").should("not.exist");
    cy.contains("[data-cy='module-card']", "CM3101").should("be.visible");
  });

  it("should not display any modules if no filters are selected", () => {
    cy.getByTestId("active-filter").click();
    cy.getByTestId("module-card").should("not.exist");
  });

  it("should display active and archived modules when both filters are selected", () => {
    cy.getByTestId("archived-filter").click();
    cy.contains("[data-cy='module-card']", "CM6128").should("be.visible");
    cy.contains("[data-cy='module-card']", "CM3101").should("be.visible");
  });

  it("should only show archived modules when modules is selected", () => {
    cy.getByTestId("active-filter").click();
    cy.getByTestId("archived-filter").click();
    cy.contains("[data-cy='module-card']", "CM3101").should("not.exist");
    cy.contains("[data-cy='module-card']", "CM6128").should("be.visible");
  });
});
