/// <reference types='cypress' />
describe("Admin module list details interactions", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
  });

  it("should go to correct module when module link is clicked", () => {
    cy.visit("/admin/module-list/");
    cy.getByTestId("linked-module").eq(1).click();
    cy.url().should("include", "/admin/module-list/");
  });

  it("should have all buttons visable", () => {
    cy.visit("/admin/module-list/CM3101");
    cy.getByTestId("edit-button").should("be.visible");
    cy.getByTestId("archive-button").should("be.visible");
  });

  it("should take to correct edit url", () => {
    cy.visit("/admin/module-list/CM3101");
    cy.getByTestId("edit-button").click();
    cy.url().should("include", "/admin/module-list/edit/");
  });

  it("should archive module", () => {
    cy.visit("/admin/module-list/CM3101");
    cy.getByTestId("archive-button").click();
    cy.visit("/admin/module-list/");
    cy.contains("Software Engineering").should("not.exist");
  });
});
