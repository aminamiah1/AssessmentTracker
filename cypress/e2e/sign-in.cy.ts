describe("Authentication", () => {
  it("should log in successfully with correct credentials and greet the user", () => {
    cy.login();

    const expectedUserName = "Test User";
    cy.get("body").should("contain", `Hi ${expectedUserName}!`);
  });

  it("should display an error with incorrect credentials", () => {
    cy.visit("/api/auth/signin");
    // Fill in the login form with incorrect credentials
    cy.wait(2000);
    cy.get("#input-email-for-credentials-provider").type(
      "wrongtestemail@test.net",
    );
    cy.get("#input-password-for-credentials-provider").type(
      "wrongsecurepassword",
    );
    cy.get("button").click();
    cy.get("div")
      .contains("Check the details you provided are correct.")
      .should("be.visible");
  });
});
