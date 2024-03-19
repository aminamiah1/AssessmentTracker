import { GenericListItem } from "./GenericListItem";

const defaults = {
  title: "Test title",
  subtitle: "Test subtitle",
};

describe("<GenericListItem />", () => {
  it("mounts", () => {
    cy.mount(<GenericListItem {...defaults} />);
  });

  it("displays all required information", () => {
    cy.mount(<GenericListItem {...defaults} />);

    cy.get("h2").should("contain.text", "Test title");
    cy.get("h3").should("contain.text", "Test subtitle");
  });

  it("displays side text when provided", () => {
    const sideText = "Test side text";
    cy.mount(<GenericListItem {...defaults} sideText={sideText} />);

    cy.get("[data-cy=side-text]").should("contain.text", sideText);
  });

  it("renders a link when href is provided", () => {
    cy.mount(<GenericListItem {...defaults} href="/test" />);

    cy.get("a").should("have.attr", "href", "/test");
  });
});
