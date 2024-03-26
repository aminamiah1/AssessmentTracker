import { ProgressListItem } from "./ProgressListItem";

const defaults = {
  progress: 0.5,
  subtitle: "Subtitle",
  title: "Title",
};

describe("<ProgressListItem />", () => {
  it("mounts", () => {
    cy.mount(<ProgressListItem {...defaults} />);
  });

  it("displays the title", () => {
    cy.mount(<ProgressListItem {...defaults} />);
    cy.contains(defaults.title).should("be.visible");
  });

  it("displays the subtitle", () => {
    cy.mount(<ProgressListItem {...defaults} />);
    cy.contains(defaults.subtitle).should("be.visible");
  });

  it("displays the progress text", () => {
    cy.mount(<ProgressListItem {...defaults} />);

    const progressText = defaults.progress * 100 + "% complete";
    cy.contains(progressText).should("be.visible");
  });

  it("displays the progress bar", () => {
    cy.mount(<ProgressListItem {...defaults} />);
    cy.getByTestId("progress-container").should("have.class", "h-5");
    cy.getByTestId("progress-container").should("have.class", "w-full");

    // Can't actually use the tailwind classes in the test environment without
    // dynamically building the classes, which would add unnecessary load times
    // - can maybe think about adding this in the future if need be
    cy.getByTestId("progress-bar").should("exist");

    cy.getByTestId("progress-bar").should("have.attr", "style", "width: 50%;");
    cy.getByTestId("progress-bar").should("have.class", "h-full");
  });

  it("displays the correct progress", () => {
    cy.mount(<ProgressListItem {...defaults} progress={0.8} />);
    cy.getByTestId("progress-bar").should("have.attr", "style", "width: 80%;");
  });
});
