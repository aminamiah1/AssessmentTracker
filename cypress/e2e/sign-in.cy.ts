describe("Authentication", () => {
  it("should log in successfully with correct credentials and greet the user", () => {
    cy.visit("/admin/sign-in");
    cy.get('input[name="email"]').type("leader@test.net");
    cy.get('input[name="password"]').type("securepassword");
    cy.get("button").contains("Sign in").click();
    cy.url().should("include", "/");

    const expectedUserName = "Liam Leader";
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
      .contains(
        "Check the details you provided are correct and not for an inactive account.",
      )
      .should("be.visible");
  });

  context("password reset", () => {
    beforeEach(() => {
      cy.login("newuser@test.net");
      cy.visit("/");
    });

    it("prompt should be visible for user that has 'mustResetPassword' flag enabled", () => {
      cy.getByTestId("password-reset-form").should("exist").and("be.visible");
      cy.getByTestId("change-password").should("be.enabled");
    });

    it("should not be allowed to use the same password", () => {
      cy.getByTestId("change-password").type("securepassword{enter}");

      cy.get("#password-reset-toast-container").should("exist");
      cy.get("#password-reset-toast-container").contains(
        "Failed to change password",
      );
    });

    it("should be able to change password successfully", () => {
      cy.getByTestId("change-password").type("differentpassword{enter}");

      cy.get("#password-reset-toast-container").should("exist");
      cy.get("#password-reset-toast-container").contains(
        "Password successfully changed",
      );
    });
  });
});
