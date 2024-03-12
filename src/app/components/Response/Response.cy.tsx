import { $Enums } from "@prisma/client";
import { Response } from "./Response";

const choices = ["Red", "Blue", "Green", "Yellow"];

const defaults = {
  questionId: "0",
  responseType: "string" as $Enums.Data_type,
  assessmentId: 0,
  previousResponse: "",
};

describe("<Response />", () => {
  beforeEach(() => {
    cy.intercept("PUT", "/api/assessments/0/responses/0", {
      statusCode: 200,
    }).as("saveResponse");
  });

  it("mounts", () => {
    cy.mount(<Response {...defaults} />);
  });

  context("<TextArea />", () => {
    it("displays a textarea for a 'text/string' response type", () => {
      cy.mount(<Response {...defaults} responseType="string" />);
      cy.getByTestId("response").get("textarea").should("exist");
    });

    it("makes a request to save the response when a string is entered and element unfocused", () => {
      cy.mount(<Response {...defaults} responseType="string" />);

      cy.getByTestId("response").get("textarea").type("Hello").blur();
      cy.wait("@saveResponse");
    });
    it("displays the previous text response if it exists", () => {
      cy.mount(
        <Response
          {...defaults}
          responseType="string"
          previousResponse="Hello"
        />,
      );
      cy.getByTestId("response").get("textarea").should("have.value", "Hello");
    });
  });

  context("<BooleanChoice />", () => {
    it("displays a radio button for a 'boolean' response type", () => {
      cy.mount(<Response {...defaults} responseType="boolean" />);
      cy.getByTestId("response")
        .get("input[type=radio]")
        .should("have.length", 2);
    });

    it("makes a request to save the response when a boolean choice is made", () => {
      cy.mount(<Response {...defaults} responseType="boolean" />);

      cy.getByTestId("response").get("input[type=radio]").first().check();
      cy.wait("@saveResponse");
    });

    it("displays the previous boolean response if it exists", () => {
      cy.mount(
        <Response {...defaults} responseType="boolean" previousResponse="No" />,
      );
      cy.getByTestId("response").get('input[value="No"]').should("be.checked");
    });

    it("should not have a default value if no previous response exists", () => {
      cy.mount(<Response {...defaults} responseType="boolean" />);
      cy.getByTestId("response")
        .get('input[type="radio"]')
        .nextAll()
        .should("not.be.checked");
    });

    it("should display as a 'yes/no' boolean even with the 'choices' prop", () => {
      cy.mount(
        <Response {...defaults} responseType="boolean" choices={choices} />,
      );
      cy.getByTestId("response").get("input[type=radio]").should("exist");
    });
  });

  context("<MultiChoice />", () => {
    it("displays a <select /> for a 'multi-choice' response type", () => {
      cy.mount(
        <Response {...defaults} responseType="string" choices={choices} />,
      );
      cy.getByTestId("response").get("select").should("exist");
    });

    it("displays the correct number of options", () => {
      cy.mount(
        <Response {...defaults} responseType="string" choices={choices} />,
      );

      cy.getByTestId("response")
        .get("option")
        // This should initially be the number of options + 1 for the default
        .should("have.length", 4 + 1);

      cy.getByTestId("response")
        .get("option")
        .first()
        .should("contain.text", "Select an option");
    });

    it("makes a request to save the response when a multi-choice is made", () => {
      cy.mount(
        <Response {...defaults} responseType="string" choices={choices} />,
      );

      cy.getByTestId("response").get("select").select("Red");
      cy.wait("@saveResponse");
    });

    it("removes the 'select an option' option when a choice is made", () => {
      cy.mount(
        <Response {...defaults} responseType="string" choices={choices} />,
      );
      cy.getByTestId("response").get("select").select("Red");
      cy.getByTestId("response").get("option").should("have.length", 4);
    });

    it("displays the previous multi-choice response if it exists", () => {
      cy.mount(
        <Response
          {...defaults}
          responseType="string"
          choices={choices}
          previousResponse="Red"
        />,
      );
      cy.getByTestId("response").get("select").should("have.value", "Red");
    });

    it("removes the 'select an option' option when a previous response exists", () => {
      cy.mount(
        <Response
          {...defaults}
          responseType="string"
          choices={choices}
          previousResponse="Red"
        />,
      );
      cy.getByTestId("response").get("option").should("have.length", 4);
    });

    it("should not display a multi-choice if only one choice is available", () => {
      cy.mount(
        <Response {...defaults} responseType="string" choices={["Red"]} />,
      );
      cy.getByTestId("response").get("select").should("not.exist");
    });
  });
});
