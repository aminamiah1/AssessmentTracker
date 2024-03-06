import { Question as IQuestion } from "@prisma/client";
import { Question } from "./Question";

let question: IQuestion = {
  part_id: -1,
  response_type: "string",
  choices: ["Red", "Blue", "Green", "Yellow"],
  id: 1,
  question_title: "What's your favourite color?",
  Response: [],
};

describe("<Question />", () => {
  it("mounts", () => {
    cy.mount(<Question question={question} />);
  });

  it("should have a class of 'question'", () => {
    cy.mount(<Question question={question} />);
    cy.get(".question").should("have.class", "question");
  });

  it("displays the prompt", () => {
    cy.mount(<Question question={question} />);
    cy.contains(question.question_title).should("be.visible");
  });

  it("displays the response component", () => {
    cy.mount(<Question question={question} />);
    cy.getByTestId("response").should("be.visible");
  });
});
