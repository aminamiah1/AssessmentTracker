describe("Edit User Form", () => {
  before(() => {
    cy.log("Seeding the database...");
    cy.exec("npm run db:seed", { timeout: 200000 });
  });

  // Visit the user management page
  beforeEach(() => {
    cy.login();
    cy.visit("/ps-team/user-management");
  });

  //Edit a user
  it("allows a ps-team member to  edit a user", () => {
    // Can edit a user
    cy.getByTestId("EditUserTable").eq(0).click();
    cy.getByTestId("name").type("New User Test");
    cy.getByTestId("email").type("newusertest@example.com");
    cy.getByTestId("password").type("examplepass");
  });
});
