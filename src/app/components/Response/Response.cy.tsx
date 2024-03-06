import { Response } from "./Response";

const choices = ["Red", "Blue", "Green", "Yellow"];

describe("<Response />", () => {
  it("mounts", () => {
    cy.mount(
      <Response questionId={0} responseType="string" previousResponse="" />,
    );
  });

  it("displays a textarea for a 'text' response type", () => {
    cy.mount(<Response questionId={0} responseType="string" />);
    cy.getByTestId("response").get("textarea").should("exist");
  });

  it("displays a radio button for a 'boolean' response type", () => {
    cy.mount(<Response questionId={0} responseType="boolean" />);
    cy.getByTestId("response")
      .get("input[type=radio]")
      .should("have.length", 2);
  });

  it("displays a select for a 'multi-choice' response type", () => {
    cy.mount(
      <Response questionId={0} responseType="string" choices={choices} />,
    );
    cy.getByTestId("response").get("select").should("exist");
    cy.getByTestId("response")
      .get("option")
      // This should initially be the number of options + 1 for the default
      .should("have.length", 4 + 1);
    cy.getByTestId("response")
      .get("option")
      .first()
      .should("contain.text", "Select an option");
  });
});
