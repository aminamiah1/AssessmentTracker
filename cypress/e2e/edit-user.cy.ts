describe("Edit User Form", () => {
  // Visit the user management page
  beforeEach(() => {
    cy.visit("http://localhost:3000/ps-team/user-management");
  });

  //Edit a user
  it("allows a ps-team member to  edit a user", () => {
    // Can edit a user
    cy.contains("button", "Edit").click();
    cy.get('[data-cy="name"]').type("New User Test");
    cy.get('[data-cy="email"]').type("newusertest@example.com");
    cy.get('[data-cy="password"]').type("examplepass");
  });
});
