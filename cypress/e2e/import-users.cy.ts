describe("UploadUsersPage Tests", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/ps-team/user-management/upload");
  });

  it("should display an error message if upload is attempted without selecting a file", () => {
    cy.get("button").contains("Upload CSV").click();
    cy.get("p").should("contain", "Please select a CSV file to upload.");
  });

  it("should successfully upload a file and display success message", () => {
    const fileName = "test-users.csv";

    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: fileName,
        mimeType: "text/csv",
      });
    });

    cy.get("button").contains("Upload CSV").click();
  });

  it("should display an error message if an incorrectly formatted CSV file is uploaded", () => {
    const fileName = "IncorrectUsers.csv";
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: fileName,
        mimeType: "text/csv",
      });
    });
    cy.get("button").contains("Upload CSV").click();
    cy.get("p").should(
      "contain",
      "CSV file headers are incorrect or have typos. Expected headers are: email, name, password, roles.",
    );
  });
});
