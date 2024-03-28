import { format } from "date-fns";

describe("Timebar progress", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader2@test.net");
  });

  it("Assessment overdue should let the user know", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");
    cy.getByTestId("dateStatus").eq(0).should("have.text", "Overdue");
    cy.getByTestId("endDateBar").eq(0).should("have.text", "26 Feb 24");
  });

  it("Assessment in tracking process should have associated dates and time left", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");

    cy.getByTestId("assessmentLeaderSearch")
      .focus()
      .type("Python next level{enter}");

    const currentDate = new Date();

    const date2MonthsAway = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 2,
      new Date().getDate(),
    );

    cy.getByTestId("dateStatusProgress")
      .eq(0)
      .should("have.text", "60 Days Left");
    cy.getByTestId("startDateBar")
      .eq(0)
      .should("have.text", format(currentDate, "dd MMM yy"));
    cy.getByTestId("endDateBar")
      .eq(0)
      .should("have.text", format(date2MonthsAway, "dd MMM yy"));
  });

  it("Assessment complete should let the user know", () => {
    cy.visit("/module-leader/assessment-management/view-assessments");

    cy.getByTestId("assessmentLeaderSearch")
      .focus()
      .type("Python Fundamentals 2{enter}");

    cy.getByTestId("dateStatus").eq(0).should("have.text", "Completed");
    cy.getByTestId("endDateBar").eq(0).should("have.text", "26 Feb 24");
  });
});
