/// <reference types='cypress' />
describe("Archive Module", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/admin/module-list");
  });

  it("should archive a module", () => {
    cy.contains("[data-cy='linked-module']", "Module To Archive").click();
    cy.getByTestId("archive-button").click();
    cy.visit("/admin/module-list");
    cy.contains("[data-cy='module-card']", "Software Engineering").should(
      "be.visible",
    );
    cy.contains("[data-cy='module-card']", "Module To Archive").should(
      "not.exist",
    );
  });
});
