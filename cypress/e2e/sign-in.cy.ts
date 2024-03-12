describe("Authentication", () => {
  it("should log in successfully with correct credentials and greet the user", () => {
    cy.visit("/admin/sign-in");
    cy.get('input[name="email"]').type("leader@test.net");
    cy.get('input[name="password"]').type("securepassword");
    cy.get("button").contains("Sign in").click();
    cy.url().should("include", "/");

    const expectedUserName = "Module Leader";
    cy.get("body").should("contain", `Hi ${expectedUserName}!`);
  });

  it("should display an error with incorrect credentials", () => {
    cy.visit("/admin/sign-in");
    // Fill in the login form with incorrect credentials
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
