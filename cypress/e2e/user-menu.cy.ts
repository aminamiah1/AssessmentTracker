describe("User profile menu", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
  });

  it("Profile menu is visible at the top of the page", () => {
    cy.visit("/ps-team/user-management");
    cy.getByTestId("profilePic").click();
    cy.getByTestId("profileMenu")
      .should("be.visible")
      .and("have.class", "fixed")
      .and("have.class", "top-0");
  });

  it("Shows profile details for current user", () => {
    cy.visit("/ps-team/user-management");
    cy.getByTestId("profilePic").click();
    cy.contains("p", "ps@test.net").should("be.visible");
    cy.contains("p", "PS Team User").should("be.visible");
    cy.contains("p", "ps team").should("be.visible");
  });

  // No access to navbar anymore without login so removed test

  // it("Shows a message if not logged in", () => {
  //   cy.visit("/ps-team/user-management");
  //   cy.clearAllSessionStorage();
  //   cy.clearAllCookies();
  //   cy.clearAllLocalStorage();
  //   cy.visit("/ps-team/user-management");
  //   cy.getByTestId("profilePic").click();
  //   cy.contains("p", "Not logged in!").should("be.visible");
  // });
});
