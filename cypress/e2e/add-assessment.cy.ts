describe("Add a assessment", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader@test.net");
  });

  it("allows a module leader to add a assessment", () => {
    // By visting the create assessments page and typing out the details
    cy.visit("/module-leader/assessment-management/create-assessment");

    // Enter test assessment form data
    cy.getByTestId("name").type("new assessment");

    cy.contains("label", "Module")
      .next()
      .find("input")
      .eq(0)
      .type("Example Module{enter}");

    cy.contains("label", "Assessment Type")
      .next()
      .find("input")
      .eq(0)
      .type("Portfolio{enter}");

    cy.contains("label", "Internal Moderators")
      .next()
      .find("input")
      .eq(0)
      .type("Ian Internal{enter}");

    cy.contains("label", "External Examiners")
      .next()
      .find("input")
      .eq(0)
      .type("External Eric{enter}");

    cy.contains("label", "Panel Members")
      .next()
      .find("input")
      .eq(0)
      .type("Paul Panel{enter}");

    cy.getByTestId("submit").click();

    cy.visit("/module-leader/assessment-management/view-assessments");

    cy.getByTestId("assessmentName")
      .last()
      .should("have.text", "new assessment");

    cy.getByTestId("assigneeText")
      .last()
      .should("have.text", "Sam Super ●module leader");
  });

  // Pass if they cannot submit a blank assessment name
  it("does not allow a module leader to submit an assessment with a blank name", () => {
    // By visting the create assessments page and typing out the details
    cy.visit("/module-leader/assessment-management/create-assessment");

    cy.contains("label", "Module")
      .next()
      .find("input")
      .eq(0)
      .type("Computing basics 1{enter}");

    cy.contains("label", "Assessment Type")
      .next()
      .find("input")
      .eq(0)
      .type("Portfolio{enter}");

    cy.contains("label", "Internal Moderator")
      .next()
      .find("input")
      .eq(0)
      .type("Ian Internal{enter}");

    cy.contains("button", "Create Assessment").click();

    cy.contains("label", "Assessment Title").should("have.value", ""); // Should still be on the same page as not submitted

    // Test validation message appears
    cy.getByTestId("name").then(($input: any) => {
      // Had to change this to be browser-agnostic (not checking entire string,
      // just that some of the string is what we expect it to be)
      expect($input[0].validationMessage).to.include("Please fill");
    });
  });
});
