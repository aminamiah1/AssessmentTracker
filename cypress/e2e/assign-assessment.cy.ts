describe("Filter assessments on ps team assessment viewing dashboard", () => {
  // before(() => {
  //   cy.log("Seeding the database...");
  //   cy.exec("npm run db:seed", { timeout: 200000 });
  // });

  beforeEach(() => {
    cy.login();
    cy.visit("/ps-team/assessment-management");
  });

  // Can assign the test user as an assignee and setter to the assessment
  it("allows a ps-team member to assign users to assessment", () => {
    cy.getByTestId("assignUsers").eq(0).click();

    cy.contains("label", "Assessment Setter")
      .next()
      .find("input")
      .eq(0)
      .type("Test User{enter}");

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .eq(0)
      .type("Test User{enter}");

    cy.contains("button", "Submit").click();

    cy.getByTestId("assigneeText").eq(0).should("have.text", "Test User");
  });
});
