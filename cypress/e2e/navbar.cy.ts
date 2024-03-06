describe("Navbar", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/admin/module-list");
  });

  it("Navbar is visible at the top of the page", () => {
    cy.get("nav")
      .should("be.visible")
      .and("have.class", "fixed")
      .and("have.class", "top-0");
  });

  it("shows all navigation links for a user with all roles", () => {
    cy.contains("a", "Module List").should("be.visible");
    cy.contains("a", "User Management").should("be.visible");
    cy.contains("a", "Assessment Management").should("be.visible");
  });
});
