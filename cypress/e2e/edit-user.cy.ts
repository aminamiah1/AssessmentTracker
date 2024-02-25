describe("Edit User", () => {
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

    cy.createUserIfNotExists(
      "newuser2@example.com",
      "New User 2",
      "strongpassword2",
      ["ps_team", "module_leader"],
    );

    cy.createUserIfNotExists(
      "newuser@example.com",
      "New User",
      "strongpassword",
      ["ps_team", "module_leader"],
    );

    cy.visit("/ps-team/user-management");
  });

  it("allows a ps-team member to edit a user", () => {
    cy.get('[data-cy="EditUser"]').eq(0).click();
    cy.get('[data-cy="name"]').clear().type("New User Test");
    cy.get('[data-cy="email"]').clear().type("newusertest@example.com");
    cy.get('[data-cy="password"]').clear().type("examplepass");
  });
});
