import { IQuestion } from "@/app/types/form";
import { Question } from "./Question";

const QUESTION: IQuestion = {
  id: 1,
  prompt: "What is your name?",
  responseType: "text",
};

describe("<Question />", () => {
  beforeEach(() => {
    cy.mount(<Question question={QUESTION} />);
  });

  it("mounts", () => {});

  it("should have a class of 'question'", () => {
    cy.get(".question").should("have.class", "question");
  });

  it("displays the prompt", () => {
    cy.contains(QUESTION.prompt).should("be.visible");
  });

  it("displays the response component", () => {
    cy.getByTestId("response").should("be.visible");
  });

  it("displays the response component as a textarea", () => {
    cy.getByTestId("response").get("textarea").should("exist");
  });
});
