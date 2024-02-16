describe("Navbar", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Navbar is visible at the top of the page", () => {
    cy.get("nav")
      .should("be.visible")
      .and("have.class", "fixed")
      .and("have.class", "top-0");
  });

  it("Sidebar toggle works on smaller screens", () => {
    cy.viewport("iphone-6");
    cy.get("#logo-sidebar").should("have.class", "-translate-x-full");
    cy.get('button[aria-controls="logo-sidebar"]').click();
    cy.get("#logo-sidebar").should("not.have.class", "-translate-x-full");
  });
});
