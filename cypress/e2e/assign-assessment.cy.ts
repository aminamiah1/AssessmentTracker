describe("Assign users by pop-up form activated on assessment tile button", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/ps-team/assessment-management");
  });

  // Does not allow blank selections to go through
  it("Does not allow blank setter and assignee selections to go through", () => {
    cy.getByTestId("assignUsers").eq(0).click();

    cy.contains("label", "Assignees").next().find("input").eq(0).clear();

    cy.contains("button", "Submit").click({ force: true });

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .eq(0)
      .then(($input: any) => {
        expect($input[0].validationMessage);
      });
  });

  // Can assign the test user as an assignee and setter to the assessment
  it("allows a ps-team member to assign users to assessment", () => {
    cy.getByTestId("assignUsers").eq(0).click();

    cy.contains("label", "Assessment Setter")
      .next()
      .find("input")
      .eq(0)
      .type("Test User")
      .blur();

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .eq(0)
      .type("Test User")
      .blur();

    cy.contains("button", "Submit").click();

    cy.getByTestId("assigneeText")
      .eq(0)
      .should("have.text", "Liam Leader  ● module leader");
  });
});
