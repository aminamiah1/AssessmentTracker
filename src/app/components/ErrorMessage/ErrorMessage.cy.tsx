import ErrorMessage from "./ErrorMessage";

describe("<ErrorMessage />", () => {
  it("mounts", () => {
    cy.mount(<ErrorMessage error={"default"} />);
  });

  it("should have an error message", () => {
    cy.mount(<ErrorMessage error={"default"} />);
    cy.getByTestId("error-message").should(
      "have.text",
      "Something went wrong.",
    );
  });

  it("should display a session-related error", () => {
    cy.mount(<ErrorMessage error={"SessionRequired"} />);
    cy.getByTestId("error-message").should(
      "have.text",
      "You need to sign in to access this page.",
    );
  });

  it("should display a credentials-related error", () => {
    cy.mount(<ErrorMessage error={"CredentialsSignin"} />);
    cy.getByTestId("error-message").should(
      "have.text",
      "Check the details you provided are correct and not for an inactive account.",
    );
  });
});
