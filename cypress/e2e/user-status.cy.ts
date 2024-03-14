describe("User Status", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
  });

  // De-activate a user account
  it("allows a ps-team member to mark a user inactive and toggle to see inactive users", () => {
    // Mark a user as inactive
    cy.visit("/ps-team/user-management");

    cy.getByTestId("deactivateButton").eq(0).click();

    cy.getByTestId("deactivateConfirmButton").click();

    cy.getByTestId("toggleStatusViewButton").click();

    cy.getByTestId("toggleStatusViewButton").should(
      "have.text",
      "Currently Inactive Users Shown",
    );
  });

  // Activate a user account
  it("allows a ps-team member to mark a user active and toggle to see active users", () => {
    // Mark a user as inactive and then active
    cy.visit("/ps-team/user-management");

    cy.getByTestId("deactivateButton").eq(0).click();

    cy.getByTestId("deactivateConfirmButton").click();

    cy.getByTestId("toggleStatusViewButton").click();

    cy.getByTestId("activateButton").eq(0).click();

    cy.getByTestId("activateConfirmButton").click();

    cy.getByTestId("toggleStatusViewButton").click();

    cy.getByTestId("toggleStatusViewButton").should(
      "have.text",
      "Currently Active Users Shown",
    );
  });

  it("handles invalid deactivate api call with appropriate message returned", () => {
    // Visit API with invalid user id and handle gracefully
    cy.request({
      method: "POST",
      url: "/api/ps-team/user/deactivate?=invalidid",
      body: { id: "invalidid" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.contain({
        message: "Error updating user status.",
      });
    });
  });

  it("handles invalid activate api call with appropriate message returned", () => {
    // Visit API with invalid user id and handle gracefully
    cy.request({
      method: "POST",
      url: "/api/ps-team/user/activate?=invalidid",
      body: { id: "invalidid" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.contain({
        message: "Error updating user status.",
      });
    });
  });
});
