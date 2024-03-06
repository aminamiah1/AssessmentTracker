describe("View users", () => {
  before(() => {
    cy.log("Seeding the database...");
    cy.exec("npm run db:seed", { timeout: 200000 });
  });

  beforeEach(() => {
    cy.login();
  });

  // Can view users
  it("allows a ps-team member to view users", () => {
    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/ps-team/users/get", {
      fixture: "users.json",
    }).as("getUsers");

    // Users are rendered in the table
    cy.visit("/ps-team/user-management");
    cy.contains("td", "Alice Johnson");
  });
});
