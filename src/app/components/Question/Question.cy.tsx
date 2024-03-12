import { Question } from "./Question";

const booleanQuestion: QuestionWithResponse = {
  part_id: -1,
  response_type: "boolean",
  choices: [],
  id: 1,
  question_title: "Is this a boolean question?",
  Response: [],
};

const multichoiceQuestion: QuestionWithResponse = {
  part_id: -1,
  response_type: "string",
  choices: ["Red", "Blue", "Green", "Yellow"],
  id: 1,
  question_title: "What's your favourite color?",
  Response: [],
};

const textQuestion: QuestionWithResponse = {
  part_id: -1,
  response_type: "string",
  choices: [],
  id: 1,
  question_title: "What's your favourite color?",
  Response: [],
};

const multichoiceWithResponse: QuestionWithResponse = {
  ...multichoiceQuestion,
  Response: [
    {
      assessment_id: 0,
      question_id: 1,
      value: "Green",
      date_completed: new Date(),
    },
  ],
};

const defaults = {
  question: multichoiceQuestion,
  assessmentId: 0,
};

describe("<Question />", () => {
  beforeEach(() => {
    cy.intercept("PUT", "/api/assessments/0/responses/1", {
      statusCode: 200,
    }).as("saveResponse");
  });

  it("mounts", () => {
    cy.mount(<Question {...defaults} />);
  });

  context("visuals", () => {
    it("displays the prompt", () => {
      cy.mount(<Question {...defaults} />);
      cy.contains(defaults.question.question_title).should("be.visible");
    });

    it("displays the response component", () => {
      cy.mount(<Question {...defaults} />);
      cy.getByTestId("response").should("be.visible");
    });

    it("displays the boolean response component ", () => {
      cy.mount(<Question {...defaults} question={booleanQuestion} />);
      cy.getByTestId("response")
        .get('input[type="radio"]')
        .should("have.length", 2);
    });

    it("displays the multichoice response component ", () => {
      cy.mount(<Question {...defaults} question={multichoiceQuestion} />);
      cy.getByTestId("response").get("option").should("have.length", 5);
    });

    it("displays the text response component ", () => {
      cy.mount(<Question {...defaults} question={textQuestion} />);
      cy.getByTestId("response").get("textarea").should("be.visible");
    });

    it("displays the previous response", () => {
      cy.mount(<Question {...defaults} question={multichoiceWithResponse} />);
      cy.getByTestId("response")
        .get("select")
        .invoke("val")
        .should("eq", multichoiceWithResponse.Response[0].value);
    });
  });

  context("functionality", () => {
    it("allows the user to choose an option", () => {
      cy.mount(<Question {...defaults} question={multichoiceQuestion} />);
      cy.getByTestId("response").get("select").select("Green");

      cy.getByTestId("response")
        .get("select")
        .invoke("val")
        .should("eq", "Green");
    });

    it("allows the user to choose a boolean option", () => {
      cy.mount(<Question {...defaults} question={booleanQuestion} />);
      cy.getByTestId("response").get('input[value="Yes"]').check();

      cy.getByTestId("response").get('input[value="Yes"]').should("be.checked");
    });

    it("allows the user to enter text", () => {
      cy.mount(<Question {...defaults} question={textQuestion} />);
      cy.getByTestId("response").get("textarea").type("Hello");

      cy.getByTestId("response").get("textarea").should("have.value", "Hello");
    });
  });
});
