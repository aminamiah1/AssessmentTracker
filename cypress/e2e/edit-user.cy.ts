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

    cy.visit("/ps-team/user-management");
  });

  it("allows a ps-team member to edit a user", () => {
    //Create a new user for pipeline test
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
      .type("module_leader{enter}{enter}");
    cy.contains("button", "Create New User").click({ force: true });

    cy.intercept("POST", "/api/ps-team/create-users", {
      statusCode: 200,
      body: {
        name: "New User",
        email: uniqueEmail,
        roles: "module_leader",
        password: "example",
      },
    }).as("addUser");

    cy.get('[data-cy="EditUser"]').eq(0).click();
    cy.get('[data-cy="name"]').clear().type("New User Test");
    // Get unique email to stop user already exists error
    cy.get('[data-cy="email"]').clear().type("newusertest@example.com");
    cy.get('[data-cy="password"]').clear().type("examplepass");
    cy.get('[data-cy="ClosePopUp"]').click();

    // Delete last user added
    cy.get('[data-cy="DeleteUser"]').last().click();
    cy.get('[data-cy="DeleteUserConfirm"]').click();
  });
});
