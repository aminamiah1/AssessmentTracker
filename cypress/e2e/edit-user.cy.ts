describe("Edit User Form", () => {
  // Visit the user management page
  beforeEach(() => {
    cy.visit("http://localhost:3000/ps-team/user-management");
  });

  it("allows a ps-team member to  edit a user", () => {
    // Create new user
    cy.contains("button", "Create New User").click();
    cy.get('[data-cy="name"]').type("New User Test");
    cy.get('[data-cy="email"]').type("newusertest@example.com");
    cy.get('[data-cy="password"]').type("examplepass");
    cy.get("[id^=react-select-3-input]").type("module_leader{enter}{enter}");
    cy.intercept("POST", "/api/ps-team/create-users", {
      statusCode: 200,
      body: {
        name: "New User Test",
        email: "newusertest@example.com",
        roles: "module_leader",
        password: "example",
      },
    }).as("addUser");
    cy.get('[data-cy="CreateUser"]').click();

    // Edit the new user
    cy.get("table")
      .should("be.visible")
      .contains("td", "New User Test")
      .next()
      .next()
      .next()
      .click();
    cy.get('[data-cy="name"]').clear().type("New User 2");
    cy.get('[data-cy="email"]').clear().type("newuser2@example.com");
    cy.get('[data-cy="password"]').clear().type("examplepass");
    cy.intercept("POST", "/api/ps-team/create-users", {
      statusCode: 200,
      body: {
        name: "New User 2",
        email: "newuser2@example.com",
        roles: "module_leader",
        password: "example",
      },
    }).as("addUser");
    cy.get('[data-cy="EditUser"]').click();
    cy.on(".Toastify__toast-body", (str) => {
      expect(str).to.equal(`User edited successfully!`);
    });

    // Delete the edited user
    cy.get("table")
      .should("be.visible")
      .contains("td", "New User 2")
      .next()
      .next()
      .click();
  });
});
