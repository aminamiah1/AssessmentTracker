describe("Add or edit a assessment as module leader or ps team", () => {
  // Module leader assessment management scenarios
  context("Part 1 - Module leader", () => {
    // Module leader logging in, leader only used in this test to isolate
    beforeEach(() => {
      cy.login("leader4@test.net");
      cy.visit("/module-leader/assessment-management/create-assessment");
    });

    it("allows a module leader to add a assessment", () => {
      // Enter test assessment form data
      cy.getByTestId("name").type("test assessment");

      cy.contains("label", "Module")
        .next()
        .find("input")
        .eq(0)
        .type("Python Apps 3{enter}");

      cy.contains("label", "Assessment Type")
        .next()
        .find("input")
        .eq(0)
        .type("Portfolio{enter}");

      // Choosing a assignee for each required role type
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

      cy.getByTestId("submit-button").click({ force: true });

      cy.wait(1);

      cy.visit("/module-leader/assessment-management/");

      // Go here as the create assessment page goes back to last page on submission automatically
      cy.getByTestId("viewAssessmentsButton").click({ force: true });

      // Check assessment submitted successfully by verifying tile with attributes exists
      cy.getByTestId("assessmentName")
        .last()
        .should("have.text", "test assessment");

      cy.getByTestId("assigneeText")
        .last()
        .should("have.text", "Lemmy Leader ● module leader");
    });

    it("does not allow a module leader to submit an assessment with a blank name", () => {
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

      // Test validation message appears alerting them to fill in the assessment title field
      cy.getByTestId("name").then(($input: any) => {
        // Had to change this to be browser-agnostic (not checking entire string,
        // just that some of the string is what we expect it to be)
        expect($input[0].validationMessage).to.include("Please fill");
      });
    });

    it("should allow a module leader to add an assessment with a proforma link", () => {
      // Enter test assessment form data
      cy.getByTestId("name").type("New Assessment with Proforma");

      cy.contains("label", "Module")
        .next()
        .find("input")
        .eq(0)
        .type("Example Module{enter}");

      cy.contains("label", "Assessment Type")
        .next()
        .find("input")
        .eq(0)
        .type("Written Assessment{enter}");

      // Choosing a assignee for each required role type
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

      cy.getByTestId("proforma-link").type(
        "https://cf.sharepoint.com/:b:/r/teams/ProformaFiles/Shared%20Documents/General/Proforma%20Example.pdf?csf=1&web=1&e=dn1Fk6",
      );

      cy.getByTestId("submit-button").click();
      // TODO: Check to see if the assessment has been created from the view-assessments page, and that it has the proforma link.
    });

    it("should not allow a module leader to add an assessment with an invalid proforma link", () => {
      // Enter test assessment form data
      cy.getByTestId("name").type("New Assessment with Proforma");

      cy.contains("label", "Module")
        .next()
        .find("input")
        .eq(0)
        .type("Python Apps 3{enter}");

      cy.contains("label", "Assessment Type")
        .next()
        .find("input")
        .eq(0)
        .type("Written Assessment{enter}");

      // Choosing a assignee for each required role type
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

      cy.getByTestId("proforma-link").type(
        "https://cf.sharepoint.com/INVALID_LINK",
      );

      cy.getByTestId("submit-button").click();

      cy.get(".Toastify__toast-container").should(
        "contain",
        "Please input a valid link for the proforma. The link to the Teams channel can be found at the bottom of the page.",
      );
    });
  });

  // PS team assessment management scenarios
  context("Part 2 - PS Team", () => {
    // PS team member logging in
    beforeEach(() => {
      cy.login("ps@test.net");
    });

    it("does not allow ps team to submit an assessment with a no module leaders module", () => {
      // By visting the edit assessment page and typing out the details
      cy.visit("/module-leader/assessment-management/create-assessment?id=2");

      cy.contains("label", "Module")
        .next()
        .find("input")
        .eq(0)
        .type("Software Engineering{enter}");

      cy.contains("button", "Edit Assessment").click();

      // When error occurs due to module having no module leader
      cy.on("uncaught:exception", (e, runnable) => {
        if (
          e.message.includes(
            "Please make sure assessment module has module leaders assigned",
          )
        ) {
          return false;
        }
      });

      // User should get error message alerting them to make sure module targeted has module leaders assigned first
      cy.get(".Toastify__toast-icon", { timeout: 10000 })
        .next()
        .should(
          "contain.text",
          "Please make sure assessment module has module leaders assigned.",
        );
    });

    it("allows ps team to edit a assessment successfully", () => {
      cy.visit("/ps-team/assessment-management");

      // Enter test assessment form data
      cy.getByTestId("assessmentName").contains("test assessment").click();

      cy.contains("label", "Assessment Type")
        .next()
        .find("input")
        .eq(0)
        .type("Portfolio{enter}");

      cy.contains("label", "Module")
        .next()
        .find("input")
        .eq(0)
        .type("Python Apps 3{enter}");

      cy.getByTestId("submit-button").click();

      cy.visit("/ps-team/assessment-management");

      // Assessment should be edited and have module changed to python apps 3
      cy.getByTestId("moduleTypeText")
        .last()
        .should("have.text", "Python Apps 3 ● Portfolio");
    });
  });
});
