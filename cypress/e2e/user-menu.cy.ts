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
});
