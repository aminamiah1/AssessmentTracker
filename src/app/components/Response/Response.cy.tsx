import { Response } from "./Response";

describe("Response", () => {
  it("mounts", () => {
    cy.mount(<Response questionId={0} responseType="text" />);
  });

  it("displays a textarea for a 'text' response type", () => {
    cy.mount(<Response questionId={0} responseType="text" />);
    cy.getByTestId("response").get("textarea").should("exist");
  });

  it("displays a radio button for a 'boolean' response type", () => {
    cy.mount(<Response questionId={0} responseType="boolean" />);
    cy.getByTestId("response")
      .get("input[type=radio]")
      .should("have.length", 2);
  });

  it("displays a select for a 'multi-choice' response type", () => {
    cy.mount(<Response questionId={0} responseType="multi-choice" />);
    cy.getByTestId("response").get("select").should("exist");
  });
});
