describe("Admin Dashboard", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3000/api/auth/session", {
      statusCode: 200,
      body: {
        user: { name: "John", email: "admin@example.com", role: "admin" },
        expires: "date-string",
      },
    });
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
