describe("Edit User Form", () => {
  // Visit the user management page
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/ps-team/user-management");
  });

  // TODO: This isn't actually testing anything...
  // Need to add a check to ensure that clicking the button
  // will save the new data
  //Edit a user
  it("allows a ps-team member to  edit a user", () => {
    // Can edit a user
    cy.getByTestId("EditUserTable").eq(0).click();
    cy.getByTestId("name").type("New User Test");
    cy.getByTestId("email").type("newusertest@example.com");
    cy.getByTestId("password").type("examplepass");
  });
});
