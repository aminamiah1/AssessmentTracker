import { IQuestion } from "@/app/types/form";
import { Question } from "./Question";

const QUESTION_TEXT: IQuestion = {
  id: 1,
  prompt: "What is your name?",
  responseType: "text",
};

describe("<Question />", () => {
  it("mounts", () => {
    cy.mount(<Question question={QUESTION_TEXT} />);
  });

  it("should have a class of 'question'", () => {
    cy.mount(<Question question={QUESTION_TEXT} />);
    cy.get(".question").should("have.class", "question");
  });

  it("displays the prompt", () => {
    cy.mount(<Question question={QUESTION_TEXT} />);
    cy.contains(QUESTION_TEXT.prompt).should("be.visible");
  });

  it("displays the response component", () => {
    cy.mount(<Question question={QUESTION_TEXT} />);
    cy.getByTestId("response").should("be.visible");
  });
});
