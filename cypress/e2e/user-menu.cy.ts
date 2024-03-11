describe("User profile menu", () => {
  before(() => {
    cy.log("Seeding the database...");
    cy.exec("npm run db:seed", { timeout: 200000 });
  });

  beforeEach(() => {
    cy.login();
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
    cy.getByTestId("profilePic").click();
    cy.contains("p", "testemail@test.net").should("be.visible");
    cy.contains("p", "Test User").should("be.visible");
    cy.contains("p", "module leader").should("be.visible");
    cy.contains("p", "ps team").should("be.visible");
  });

  it("Shows a message if not logged in", () => {
    cy.clearAllSessionStorage();
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.visit("/ps-team/user-management");
    cy.getByTestId("profilePic").click();
    cy.contains("p", "Not logged in!").should("be.visible");
  });
});
