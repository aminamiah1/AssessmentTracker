describe("View users", () => {
  beforeEach(() => {
    // Fake log in as the user
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: {
        user: {
          name: "John",
          email: "admin@example.com",
          roles: ["ps_team", "module_leader"],
        },
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
  });

  // Can view users
  it("allows a ps-team member to view users", () => {
    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/ps-team/users/get", {
      fixture: "users.json",
    }).as("getUsers");

    // Users are rendered in the table
    cy.visit("/ps-team/user-management");
    cy.contains("td", "Alice Johnson");
  });
});
