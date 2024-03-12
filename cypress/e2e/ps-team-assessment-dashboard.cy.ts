describe("Filter assessments on ps team assessment viewing dashboard", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/ps-team/assessment-management");
  });

  // Can filter and expect to see only one assessment
  it("allows a ps-team member to filter assessments", () => {
    cy.contains("label", "Type")
      .next()
      .find("input")
      .focus()
      .type("Portfolio{enter}");

    cy.contains("p", "My new assessment").should(
      "contain.text",
      "My new assessment",
    );
  });

  it("handles no assessments gracefully", () => {
    cy.intercept("GET", "/api/ps-team/assessments/get", {}).as(
      "getNoAssessments",
    );

    const noAssessmentsMessage =
      "No assessments found matching the search criteria...";

    cy.contains("div", noAssessmentsMessage).should(
      "have.text",
      noAssessmentsMessage,
    );
  });
});
