/// <reference types='cypress' />
describe("Admin edit module page", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/admin/module-list");
  });

  it("edits the module name and verifies the change", () => {
    cy.visit("/admin/module-list/edit/2");
    cy.getByTestId("module-name").clear();
    cy.getByTestId("module-name").type("Updated Module Name");
    cy.getByTestId("edit-submit").click();
    cy.visit("/admin/module-list");
    cy.contains("Updated Module Name").should("be.visible");
  });

  it("edits the module code and verifies the change", () => {
    cy.visit("/admin/module-list/edit/2");
    cy.getByTestId("module-code").clear();
    cy.getByTestId("module-code").type("CM6879");
    cy.getByTestId("edit-submit").click();
    cy.visit("/admin/module-list");
    cy.contains("CM6879").should("be.visible");
  });

  it("edits the module leaders and verifies the change", () => {
    cy.visit("/admin/module-list/edit/2");
    cy.get(".basic-multi-select").click();
    cy.get(".select__option").should("be.visible");
    cy.contains(".select__option", "Liam Leader").click();
    cy.getByTestId("edit-submit").click();
    cy.visit("/admin/module-list");
    cy.contains("Liam Leader").should("be.visible");
  });
});
