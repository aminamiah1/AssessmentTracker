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
    cy.get(".module-card")
      .first()
      .should("contain", "Software Engineering")
      .and("contain", "CM3101");
  });

  it("should display the search bar", () => {
    cy.getByTestId("search-bar").should("be.visible");
  });

  it("should show all module manage buttons", () => {
    cy.get(".module-card > div > button").each((button) => {
      // cy.wrap(button).should("exist");
      // cy.wrap(button).click();
      // cy.wrap(button).should("have.focus");
    });

    cy.get(".module-card > div > a").each((button) => {
      // cy.wrap(button).should("exist");
      // cy.wrap(button).click();
      // cy.url().should("include", "/admin/module-list/edit/");
    });
    // These buttons will eventually lead to different pages
  });

  it("should show correct modules when search term is entered", () => {
    cy.getByTestId("search-bar").type("CM3101{enter}");
    cy.get(".module-card")
      .should("contain", "Software Engineering")
      .and("have.length", 1);
    // will need to change once testing db is setup
  });
});
