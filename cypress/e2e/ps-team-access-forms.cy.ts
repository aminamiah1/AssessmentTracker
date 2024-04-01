/// <reference types='cypress' />
describe("Admin module list assessment management interactions", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
  });

  it("should allow assessment edit form to be accessed from ps team module block page", () => {
    cy.visit("/admin/module-list/CM3101");
    cy.getByTestId("editAssessmentAdmin").eq(0).click();
    cy.contains("label", "Assessment Title")
      .next()
      .eq(0)
      .should("have.value", "Cyber Security");
  });

  it("should allow assessment creation form to be accessed from ps team module block page", () => {
    cy.visit("/admin/module-list/CM3101");
    cy.getByTestId("create-assessments-button").eq(0).click();
    cy.contains("h1", "Create Assessment").should(
      "have.text",
      "Create Assessment",
    );
  });
});
