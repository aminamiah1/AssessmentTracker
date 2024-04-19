import { format, differenceInDays } from "date-fns";

describe("Assessment progress", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader2@test.net");
  });

  it("Assessment not in tracking process should have tracking not yet started displayed", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    cy.getByTestId("trackingFormToBeginStatus")
      .eq(0)
      .should("have.text", "Tracking Process Not Yet Started");
  });

  it("Assessment in tracking process should have tracking information displayed", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    cy.getByTestId("trackingStagesComplete")
      .eq(0)
      .should("have.text", "Internal Peer  Moderation  Feedback");
  });

  it("Assessment in tracking process when hovered over should have current part information", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    cy.getByTestId("progress-container").eq(0).trigger("mouseenter");
    cy.getByTestId("currentTrackingStage")
      .eq(0)
      .should("have.text", "Tracking Stage ● 4/11");
  });

  it("Assessment in tracking process has current date information displayed", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    // Caluclate time from now till the next july the 1st
    const nextJuly = new Date(
      new Date().getFullYear() + (new Date().getMonth() >= 6 ? 1 : 0),
      6,
      1,
    );
    const daysRemaining = differenceInDays(nextJuly, new Date());
    cy.getByTestId("daysLeft")
      .eq(0)
      .should("have.text", daysRemaining + " Days Left");
    cy.getByTestId("deadline")
      .eq(0)
      .should("have.text", format(nextJuly, "dd MMM yyyy"));
  });

  it("Assessment completed has information displayed", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    cy.getByTestId("completeText").eq(0).should("have.text", "Completed");
  });
});
