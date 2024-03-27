describe("User Status", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
  });

  // De-activate a user account and then re-activate targeting liam leader
  it("allows a ps-team member to mark a user active and de-activate and toggle to see active users", () => {
    // Mark a user as inactive and then active again
    cy.visit("/ps-team/user-management");

    // Use de-activate button to the side of the liam leader row
    cy.contains("td", "Liam Leader")
      .nextUntil("#deactivateButton")
      .eq(2)
      .click();

    cy.getByTestId("deactivateConfirmButton").click();

    cy.getByTestId("toggleStatusViewButton").click();

    cy.wait(1000);

    // Use activate button to the side of the liam leader row
    cy.contains("td", "Liam Leader").getByTestId("activateButton").click();

    cy.getByTestId("activateConfirmButton").click();

    cy.getByTestId("toggleStatusViewButton").click();

    cy.getByTestId("toggleStatusViewButton").should(
      "have.text",
      "Inactive Users",
    );

    // Active user is shown
    cy.contains("td", "Liam Leader");
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
});
