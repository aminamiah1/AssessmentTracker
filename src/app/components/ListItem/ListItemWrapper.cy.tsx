import { ListItemWrapper } from "./ListItemWrapper";

const defaults = {
  children: <></>,
};

describe("<ListItemWrapper />", () => {
  it("mounts", () => {
    cy.mount(<ListItemWrapper {...defaults} />);
  });

  it("renders children", () => {
    cy.mount(
      <ListItemWrapper {...defaults}>
        <div data-cy="test-child">Hello World</div>
      </ListItemWrapper>,
    );

    cy.get("[data-cy=test-child]").should("exist").and("be.visible");
  });

  it("renders a link when href is provided", () => {
    cy.mount(
      <ListItemWrapper {...defaults} href="/test">
        <div data-cy="test-child">Hello World</div>
      </ListItemWrapper>,
    );

    cy.get("a > [data-cy=list-item]").should("exist");
    cy.get("a").should("have.attr", "href", "/test");
  });

  it("renders a div when href is not provided", () => {
    cy.mount(
      <ListItemWrapper {...defaults}>
        <div data-cy="test-child">Hello World</div>
      </ListItemWrapper>,
    );

    cy.get("a > [data-cy=list-item]").should("not.exist");
    cy.get("[data-cy=list-item]").should("exist");
  });
});
