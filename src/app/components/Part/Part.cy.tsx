import { Part } from "./Part";

const PART_NAME = "Part 1";

describe("<Part />", () => {
  it("mounts", () => {
    cy.mount(<Part name={PART_NAME} />);
  });

  it("displays the part name", () => {
    cy.mount(<Part name={PART_NAME} />);
    cy.contains(PART_NAME).should("be.visible");
  });
});
