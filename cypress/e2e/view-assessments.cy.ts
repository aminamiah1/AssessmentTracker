describe("View assessments", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader@test.net");
  });

  // Pass if they can view assessments
  it("allows a module leader to view assessments", () => {
    // By visting the view assessments page
    cy.visit("/module-leader/assessment-management/view-assessments");
  });
});
