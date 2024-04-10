/// <reference types='cypress' />
describe("Admin module list assessment management interactions", () => {
  context("Can be accessed with right role", () => {
    beforeEach(() => {
      cy.login("ps@test.net");
    });

    it("should allow assessment edit form to be accessed from ps team module block page", () => {
      cy.visit("/admin/module-list/CM3101");
      cy.getByTestId("editAssessmentAdmin").eq(0).click();
      cy.contains("label", "Assessment Title")
        .next()
        .eq(0)
        .should("have.value", "Database Design");
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

  context("Denied if not right role", () => {
    beforeEach(() => {
      cy.login("internal@test.net");
    });

    it("should not allow assessment edit form to be accessed if not right role", () => {
      cy.visit("module-leader/assessment-management/create-assessment?id=2");
      cy.getByTestId("unauthorizedText").should(
        "have.text",
        "You are not authorised to view this",
      );
    });

    it("should not allow assessment creation form to be accessed if not right role", () => {
      cy.visit("module-leader/assessment-management/create-assessment");
      cy.getByTestId("unauthorizedText").should(
        "have.text",
        "You are not authorised to view this",
      );
    });
  });
});
