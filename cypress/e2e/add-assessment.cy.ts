describe("Add a assessment", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader@test.net");
  });

  // Pass if they can add a assessment's details
  it("allows a module leader to add a assessment", () => {
    // By visting the create assessments page and typing out the details
    cy.visit("/module-leader/assessment-management/create-assessment");

    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/users/get", {
      fixture: "users.json",
    }).as("getAssignees");

    // Spoof getting modules by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/modules/get?id=6", {
      fixture: "modules.json",
    }).as("getModules");

    // Enter test assessment form data
    cy.getByTestId("name").type("New Assessment");

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

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .eq(0)
      .type("Carol White{enter}");
  });

  // Pass if they cannot submit a blank assessment name
  it("does not allow a module leader to submit an assessment with a blank name", () => {
    // By visting the create assessments page and typing out the details
    cy.visit("/module-leader/assessment-management/create-assessment");

    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/users/get", {
      fixture: "users.json",
    }).as("getAssignees");

    // Spoof getting modules by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/modules/get?id=6", {
      fixture: "modules.json",
    }).as("getModules");

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

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .eq(0)
      .type("Carol White{enter}");

    cy.contains("button", "Create Assessment").click();

    cy.contains("label", "Assessment Title").should("have.value", ""); // Should still be on the same page as not submitted

    cy.getByTestId("name").then(($input: any) => {
      // Had to change this to be browser-agnostic (not checking entire string,
      // just that some of the string is what we expect it to be)
      expect($input[0].validationMessage).to.include("Please fill");
    });
  });
});
