describe("Assessment stage filter", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader2@test.net");
    cy.visit("/module-leader/assessment-management/view-assessments");
  });

  it("Check assessment stage filter displays message if no assessments associated with that stage", () => {
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

  it("Check assessments with stage applied by filter appear", () => {
    cy.getByTestId("stageLabel")
      .next()
      .find("input")
      .focus()
      .type("Internal Peer Moderation{enter}");

    // Should be assessment in internal peer moderation stage
    cy.getByTestId("trackingStagesComplete")
      .eq(0)
      .should("have.text", "Internal Peer");

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
