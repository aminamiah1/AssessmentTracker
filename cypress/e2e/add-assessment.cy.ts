describe("Add a assessment", () => {
  // Module leader logging in
  beforeEach(() => {
    cy.login("leader@test.net");
    cy.visit("/module-leader/assessment-management/create-assessment");
  });

  // Pass if they can add a assessment's details
  it("should allow a module leader to add an assessment without a proforma link", () => {
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

    // Submit the form
    cy.getByTestId("submit-button").click();

    // TODO: Check to see if the assessment has been created from the view-assessments page.
  });

  it("should allow a module leader to add an assessment with a proforma link", () => {
    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/users/get", {
      fixture: "users.json",
    }).as("getAssignees");

    // Spoof getting modules by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/modules/get?id=6", {
      fixture: "modules.json",
    }).as("getModules");

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

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .eq(0)
      .type("Bob Smith{enter}");

    cy.getByTestId("proforma-link").type(
      "https://cf.sharepoint.com/:b:/r/teams/ProformaFiles/Shared%20Documents/General/Proforma%20Example.pdf?csf=1&web=1&e=dn1Fk6",
    );

    cy.getByTestId("submit-button").click();

    // TODO: Check to see if the assessment has been created from the view-assessments page, and that it has the proforma link.
  });

  // Pass if they cannot submit a blank assessment name
  it("should not allow a module leader to submit an assessment with a blank name", () => {
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

  it("should not allow a module leader to add an assessment with an invalid proforma link", () => {
    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/users/get", {
      fixture: "users.json",
    }).as("getAssignees");

    // Spoof getting modules by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/modules/get?id=6", {
      fixture: "modules.json",
    }).as("getModules");

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

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .eq(0)
      .type("Alice Johnson{enter}");

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
