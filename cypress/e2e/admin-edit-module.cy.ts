/// <reference types='cypress' />
describe("Admin edit module page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/admin/module-list");
  });

  it("should be able to access the edit module page", () => {
    cy.get(".edit-button").last().should("be.visible").click();
    cy.url().should("include", "/admin/module-list/edit/CM6127");
  });

  it("should be able to change the name of a module", () => {
    cy.visit("/admin/module-list/edit/CM6127");
    cy.getByTestId("edit-module-name-input").type("Updated Module Name");
    cy.getByTestId("edit-module-name-submit").click();
    cy.visit("/admin/module-list");
    cy.url().should("not.include", "/edit/");
    cy.contains("Updated Module Name").should("exist");
  });

  it("should be able to change the code of a module", () => {
    cy.visit("/admin/module-list/edit/CM6127");
    cy.getByTestId("edit-module-code-input").type("CM6128");
    cy.getByTestId("edit-module-code-submit").click();
    cy.visit("/admin/module-list");
    cy.url().should("not.include", "/edit/");
    cy.contains("CM6128").should("exist");
  });
});
