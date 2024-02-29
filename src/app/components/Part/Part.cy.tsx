import { Part } from "./Part";
import importedPart from "./parts.json";

const part: PartWithQuestions = importedPart as PartWithQuestions;

describe("<Part />", () => {
  it("mounts", () => {
    cy.mount(<Part part={part} />);
  });

  it("displays the part name", () => {
    cy.mount(<Part part={part} />);
    cy.get("h1").first().contains("Test").should("be.visible");
  });

  it("displays the correct number of questions", () => {
    cy.mount(<Part part={part} />);
    cy.get(".question").should("have.length", part.Question.length);
  });
});
