describe("Assessment progress", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader2@test.net");
  });

  // Check assessment with tracking process not yet started has message displayed
  it("Assessment not in tracking process should have tracking not yet started displayed", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    cy.getByTestId("trackingFormToBeginStatus")
      .eq(0)
      .should("have.text", "Tracking Process Not Yet Started");
  });

  // Check assessment currently in tracking process has visual progress displayed
  it("Assessment in tracking process should have tracking information displayed", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    cy.getByTestId("trackingStagesComplete")
      .eq(0)
      .should("have.text", "Tracking Stages Complete: 4/11");
    cy.getByTestId("lastCompletedPart")
      .eq(0)
      .should("have.text", "Moderation panel comments");
  });
});
