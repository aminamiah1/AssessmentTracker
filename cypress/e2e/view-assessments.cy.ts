describe("View assessments", () => {
  before(() => {
    cy.log("Seeding the database...");
    cy.exec("npm run db:seed", { timeout: 200000 });
  });

  // Module leader logging in
  beforeEach(() => {
    cy.login();
  });

  // Pass if they can view assessments
  it("allows a module leader to view assessments", () => {
    // By visting the view assessments page
    cy.visit("/module-leader/assessment-management/view-assessments");
  });
});
