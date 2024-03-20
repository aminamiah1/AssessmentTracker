describe("Assessment stage filter", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader2@test.net");
  });

  // Check assessment stage filter displays message if no assessments associated with that stage
  it("Check assessment stage filter displays message if no assessments associated with that stage", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");

    cy.getByTestId("stageLabel")
      .next()
      .find("input")
      .focus()
      .type("Assessment availability{enter}{enter}");

    cy.getByTestId("filterMessage").should(
      "have.text",
      "No assessments found matching the search criteria...",
    );
  });

  // Check assessment currently in tracking process are shown with filter applied
  it("Check assessments with stage applied by filter appear", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");

    cy.getByTestId("stageLabel")
      .next()
      .find("input")
      .focus()
      .type("Moderation panel comments{enter}");

    // Should be assessment in moderation panel comments stage
    cy.getByTestId("lastCompletedPart")
      .eq(0)
      .should("have.text", "Moderation panel comments");

    // Reset filter
    cy.getByTestId("resetFilter").click();

    cy.getByTestId("stageLabel")
      .next()
      .find("input")
      .focus()
      .type("External examiner feedback{enter}");

    // Should be assessment in external examiner stage
    cy.getByTestId("lastCompletedPart")
      .eq(0)
      .should("have.text", "External examiner feedback");

    // Reset filter
    cy.getByTestId("resetFilter").click();

    cy.getByTestId("stageLabel")
      .next()
      .find("input")
      .focus()
      .type("Process Not Started{enter}");

    // Should be assessment with no stage started
    cy.getByTestId("trackingFormToBeginStatus")
      .eq(0)
      .should("have.text", "Tracking Process Not Yet Started");
  });
});
