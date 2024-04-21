import { SWRConfig } from "swr";
import { TaskList } from "./TaskList";
import fixture from "./tasks.json";

const tasks =
  fixture.tasksWithNoResponses as unknown as AssessmentAndPartAPIResponse[];
const withOneResponse =
  fixture.tasksWithResponses as unknown as AssessmentAndPartAPIResponse[];
const withAllResponses =
  fixture.tasksWithAllResponses as unknown as AssessmentAndPartAPIResponse[];

const defaults = {
  userId: 0,
};

// As per SWR's documentation:
// https://swr.vercel.app/docs/advanced/cache#reset-cache-between-test-cases
Cypress.Commands.add("mountNoCache", (component, options) => {
  return cy.mount(
    <SWRConfig value={{ provider: () => new Map() }}>{component}</SWRConfig>,
    options,
  );
});

describe("<TaskList />", () => {
  it("mounts", () => {
    cy.mountNoCache(<TaskList {...defaults} />);
  });

  context("Loading", () => {
    it("displays a list of tasks", () => {
      cy.intercept("GET", "/api/users/0/todos", tasks).as("getTasks");
      cy.mountNoCache(<TaskList {...defaults} />);
      cy.wait("@getTasks");
      cy.getByTestId("task-list-container")
        .children()
        .should("have.length", tasks.length);
    });

    it("displays a message when there are no tasks", () => {
      cy.intercept("GET", "/api/users/0/todos", []).as("getTasks");
      cy.mountNoCache(<TaskList {...defaults} />);
      cy.wait("@getTasks");
      cy.contains("No tasks! 🎉");
    });
  });

  context("Module info", () => {
    it("contains module name and code", () => {
      cy.intercept("GET", "/api/users/0/todos", tasks).as("getTasks");
      cy.mountNoCache(<TaskList {...defaults} />);
      cy.wait("@getTasks");
      cy.getByTestId("module-info")
        .first()
        .should("have.text", "CM1001 The world of Cyber Security");

      cy.getByTestId("module-info")
        .last()
        .should("have.text", "CM1002 Data Analysis and Database Design");
    });

    it("contains module leaders", () => {
      cy.intercept("GET", "/api/users/0/todos", tasks).as("getTasks");
      cy.mountNoCache(<TaskList {...defaults} />);
      cy.wait("@getTasks");
      cy.getByTestId("module-leaders")
        .first()
        .should("have.text", "Module LeaderJohn Doe");

      cy.getByTestId("module-leaders")
        .last()
        .should("have.text", "No module leaders assigned");
    });
  });

  context("Without responses", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/users/0/todos", tasks).as("getTasks");
      cy.mountNoCache(<TaskList {...defaults} />);
      cy.wait("@getTasks");
    });

    it("displays the correct number of questions", () => {
      cy.getByTestId("progress-text")
        .first()
        .should("have.text", "2 questions remaining");

      cy.getByTestId("progress-text")
        .last()
        .should("have.text", "5 questions remaining");
    });

    it("displays the correct progress", () => {
      cy.getByTestId("progress-bar")
        .first()
        .should("have.attr", "style", "width: 0%;");

      cy.getByTestId("progress-bar")
        .last()
        .should("have.attr", "style", "width: 0%;");
    });
  });

  context("With 1 response", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/users/0/todos", withOneResponse).as("getTasks");
      cy.mountNoCache(<TaskList {...defaults} />);
      cy.wait("@getTasks");
    });

    it("displays the correct number of questions", () => {
      cy.getByTestId("progress-text")
        .first()
        .should("have.text", "1 question remaining");

      cy.getByTestId("progress-text")
        .last()
        .should("have.text", "4 questions remaining");
    });

    it("displays the correct progress", () => {
      cy.getByTestId("progress-bar")
        .first()
        .should("have.attr", "style", "width: 50%;");

      cy.getByTestId("progress-bar")
        .last()
        .should("have.attr", "style", "width: 20%;");
    });
  });

  context("With all responses", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/users/0/todos", withAllResponses).as(
        "getTasks",
      );
      cy.mountNoCache(<TaskList {...defaults} />);
      cy.wait("@getTasks");
    });

    it("displays the correct number of questions", () => {
      cy.getByTestId("progress-text").each((el) => {
        expect(el.text()).to.equal(
          "All questions answered, ready for submission!",
        );
      });
    });

    it("displays the correct progress", () => {
      cy.getByTestId("progress-bar").each((el) => {
        expect(el.attr("style")).to.equal("width: 100%;");
      });
    });
  });
});
