describe("User profile menu", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/ps-team/user-management");
  });

  it("Profile menu is visible at the top of the page", () => {
    cy.getByTestId("profilePic").click();
    cy.getByTestId("profileMenu")
      .should("be.visible")
      .and("have.class", "fixed")
      .and("have.class", "top-0");
  });

  it("Shows profile details for current user", () => {
    cy.getByTestId("profilePic").click();
    cy.contains("p", "ps@test.net").should("be.visible");
    cy.contains("p", "PS Penelope").should("be.visible");
    cy.contains("p", "ps team").should("be.visible");
  });

  it("Toggle switch is visible", () => {
    cy.getByTestId("profilePic").click();
    cy.getByTestId("optInToggle").should("be.visible");
  });

  it("displays a success toast when the opt-in toggle is clicked", () => {
    cy.getByTestId("profilePic").click();
    cy.getByTestId("optInToggle").click(); // ON
    cy.get(".Toastify__toast")
      .should("be.visible")
      .and("contain", "Your preferences have been updated.");
  });

  it("has keyboard-accessible email toggle", () => {
    cy.intercept("POST", "/api/opt-in").as("optIn");

    cy.getByTestId("profilePic").click();
    cy.getByTestId("email-preference").as("toggle", { type: "static" });

    cy.getByTestId("toggle-email-reminders").focus().type("{enter}");

    cy.wait("@optIn");

    cy.getByTestId("email-preference").then((el) => {
      // toggle should have changed from either ON -> OFF, or vice versa
      cy.get("@toggle").should("not.have.value", el.text());
    });

    cy.getByTestId("email-preference").as("toggle", { type: "static" });
    cy.getByTestId("toggle-email-reminders").focus().type(" ");

    cy.wait("@optIn");

    cy.getByTestId("email-preference").then((el) => {
      // toggle should have changed from OFF -> ON, or vice versa
      cy.get("@toggle").should("not.have.value", el.text());
    });
  });

  it("can log out using the profile menu", () => {
    cy.on("uncaught:exception", (err) => {
      // Signing out throws a redirect error which we can ignore - it still
      // signs out successfully.
      // TODO: if we have time before the submission, we could look into it
      if (err.message.includes("NEXT_REDIRECT")) {
        return false;
      }
    });

    cy.intercept("POST", "/api/auth/signout", (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(200);
        res.send();
      });
    }).as("logout");

    cy.getByTestId("profilePic").click();
    cy.getByTestId("sign-out-button").click();

    cy.wait("@logout");

    cy.url().should("contain", "/sign-in");
  });
});
