describe("Import CSV", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.visit("/ps-team/assessment-management");
  });

  it("Imports the example csv correctly", () => {
    cy.getByTestId("importCSVButton").click();

    const fixtureFile = "ImportAssessments.csv";

    cy.getByTestId("fileChooser").attachFile(fixtureFile);

    cy.getByTestId("uploadCSV").click({ force: true });

    cy.contains("p", "Class Test 3").should("have.text", "Class Test 3");
  });

  it("Imports the example csv two times without errors", () => {
    cy.getByTestId("importCSVButton").click();

    const fixtureFile = "ImportAssessments.csv";

    cy.getByTestId("fileChooser").attachFile(fixtureFile);

    cy.getByTestId("uploadCSV").click({ force: true });

    cy.getByTestId("importCSVButton").click();

    cy.getByTestId("fileChooser").attachFile(fixtureFile);

    cy.getByTestId("uploadCSV").click({ force: true });

    cy.contains("p", "Class Test 3").should("have.text", "Class Test 3");
  });

  it("Informs the user if they upload an invalid csv.", () => {
    cy.getByTestId("importCSVButton").click();

    const fixtureFile = "example.json";

    cy.getByTestId("fileChooser").attachFile(fixtureFile);

    cy.getByTestId("uploadCSV").click({ force: true });

    cy.get(".Toastify__toast-icon", { timeout: 10000 }).contains(
      "div",
      "Please select a valid CSV file. Invalid file format.Error parsing csv, check format and try again",
    );
  });

  it("Informs the user if they upload an malformed csv.", () => {
    cy.getByTestId("importCSVButton").click();

    const fixtureFile = "ImportAssessmentsMalformed";

    cy.getByTestId("fileChooser").attachFile(fixtureFile);

    cy.getByTestId("uploadCSV").click({ force: true });

    cy.get(".Toastify__toast-icon", { timeout: 10000 }).contains(
      "div",
      "Please select a valid CSV file. Invalid file format.Error parsing csv, check format and try again",
    );
  });
});
