describe("Authentication", () => {
  // it("should log in successfully with correct credentials and greet the user", () => {
  //   cy.visit("/api/auth/signin");
  //   // Fill in login form with corrent credentials
  //   cy.get('input[name="email"]').type("exampleuser2@cardiff.ac.uk");
  //   cy.get('input[name="password"]').type("hatty");
  //   cy.get('button[type="submit"]').click();
  //   cy.url().should("include", "/admin/homepage");
  //   const expectedUserName = "Hatty";
  //   cy.get("body").should("contain", `Hi ${expectedUserName}!`);
  // });
  // it("should display an error with incorrect credentials", () => {
  //   cy.visit("/api/auth/signin");
  //   // Fill in the login form with incorrect credentials
  //   cy.get('input[name="email"]').type("wrong@example.com");
  //   cy.get('input[name="password"]').type("wrongPassword");
  //   cy.get("button").contains("Sign in with Credentials").click();
  //   cy.get("div")
  //     .contains("Sign in failed. Check the details you provided are correct.")
  //     .should("be.visible");
  // });
});
