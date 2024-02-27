describe("Navbar", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept("GET", "**/api/auth/session", (req) => {
      req.reply({
        body: {
          user: {
            id: 6,
            name: "Admin User",
            email: "admin@example.com",
            roles: ["ps_team", "module_leader"],
          },
          expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        },
      });
    });
    cy.visit("/");
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
