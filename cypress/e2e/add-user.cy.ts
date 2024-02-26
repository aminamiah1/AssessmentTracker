describe("Add User", () => {
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
    cy.visit("/module-leader/assessment-management");
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

  // Add a new user
  it("allows a ps-team member to add a user", () => {
    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/ps-team/users/get", {
      fixture: "users.json",
    }).as("getUsers");

    // Create a new user through form
    cy.visit("/ps-team/user-management");
    cy.contains("button", "Create New User").click();
    cy.get('[data-cy="name"]').type("New User");
    const timestamp = Date.now();
    const uniqueEmail = `newuser+${timestamp}@example.com`;
    cy.get('[data-cy="email"]').clear().type(uniqueEmail);
    cy.get('[data-cy="password"]').type("examplepass");
    cy.contains("label", "Roles")
      .next()
      .find("input")
      .focus()
      .type("module_leader{enter}");
    cy.contains("button", "X").click({ force: true });

    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/ps-team/users/get", {
      fixture: "users.json",
    }).as("getUsers");
  });
});
