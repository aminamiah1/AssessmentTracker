describe("Add User", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
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
    cy.getByTestId("name").type("New User");

    const timestamp = Date.now();
    const uniqueEmail = `newuser+${timestamp}@example.com`;

    cy.getByTestId("email").clear().type(uniqueEmail);
    cy.getByTestId("password").type("examplepass");

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
