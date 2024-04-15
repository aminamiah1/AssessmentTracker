describe("Email Opt-In Pop Up", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
    cy.clearLocalStorage();
    cy.visit("/todo");
  });

  it("displays the modal when isVisible is true", () => {
    cy.getByTestId("modal-title").should(
      "contain",
      "Confirm Your Email Subscription",
    );
  });

  it("closes the modal when the Close button is clicked", () => {
    cy.contains("Close").as("closeButton");
    cy.get("@closeButton").click();
    cy.getByTestId("modal-title").should("not.exist");
  });

  it("shows confirmation toast when Yes is clicked", () => {
    cy.getByTestId("yes-button").click();
    // Confirm the confirmation toast appears
    cy.get(".Toastify__toast-body").should(
      "contain",
      "You have been sent a confirmation email.",
    );
  });

  it("shows confirmation toast when No is clicked", () => {
    cy.getByTestId("no-button").click();
    // Confirm the confirmation toast appears
    cy.get(".Toastify__toast-body").should(
      "contain",
      "You have been sent a confirmation email.",
    );
  });
});
