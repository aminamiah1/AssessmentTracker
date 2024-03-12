import { ProgressBar } from "./ProgressBar";

// Can't actually test this component's functionality with the classnames
// because the tailwind classes are not available in the test environment,
// there is a workaround, but it would add unnecessary load times
// We can just test it in the e2e environment instead
describe("<ProgressBar />", () => {
  it("mounts", () => {
    cy.mount(<ProgressBar progress={0.1} />);
  });

  it("has the correct width at 0%", () => {
    cy.mount(<ProgressBar progress={0} />);
    cy.getByTestId("progress-container")
      .get(".h-full")
      .should("have.attr", "style", "width: 0%;");
  });

  it("has the correct width at 10%", () => {
    cy.mount(<ProgressBar progress={0.1} />);
    cy.getByTestId("progress-container")
      .get(".h-full")
      .should("have.attr", "style", "width: 10%;");
  });

  it("has the correct width at 100%", () => {
    cy.mount(<ProgressBar progress={1} />);
    cy.getByTestId("progress-container")
      .get(".h-full")
      .should("have.attr", "style", "width: 100%;");
  });
});
