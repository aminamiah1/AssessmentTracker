describe("Add User", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: {
        user: { name: "John", email: "admin@example.com", role: "ps_team" },
        expires: "date-string",
      },
    });
    cy.visit("/ps-team/user-management");
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
    }).as("getSession");
    cy.visit("/ps-team/user-management");
  });
  // Add a new user
  it("allows a ps-team member to add a user", () => {
    // Can add a user
    cy.contains("button", "Create New User").click();
    cy.get('[data-cy="name"]').type("New User");
    cy.get('[data-cy="email"]').type("newuser@example.com");
    cy.get('[data-cy="password"]').type("examplepass");
  });
});
