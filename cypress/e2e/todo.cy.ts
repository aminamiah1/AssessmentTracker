// Cypress doesn't support Next.js's SSR at the moment:
// https://nextjs.org/docs/app/building-your-application/testing/cypress

import { mutate } from "swr";

describe("/todo", () => {
  afterEach(() => {
    // Clear SWR cache
    mutate((key) => true, undefined, { revalidate: false });
  });

  it("should not yet have a task for the internal moderator", () => {
    cy.login("internal@test.net");
    cy.visit("/todo");
    cy.get("main").should("contain.text", "No tasks! 🎉");
  });

  it.only("handles errors", () => {
    cy.on("uncaught:exception", (err) => {
      return false;
    });

    cy.login("leader@test.net");

    cy.visit("/todo/abc");
    cy.getByTestId("error-title").should("contain.text", "Error");
    cy.getByTestId("error-message").should(
      "contain.text",
      "Cannot convert 'abc' to a number",
    );

    cy.visit("/todo/999999");
    cy.getByTestId("error-title").should("contain.text", "Error");
    cy.getByTestId("error-message").should(
      "contain.text",
      "No assessment found with id '999999'",
    );
  });

  context("Part 1 - Module leader", () => {
    beforeEach(() => {
      cy.login("leader@test.net");
      cy.visit("/todo");

      cy.intercept("PUT", "/api/assessments/*/responses/*", (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.equal(200);
        });
      }).as("saveResponse");
    });

    // Don't need to test the visuals of the part, because the components used
    // in the part have their own component tests
    it("should be able to respond to a question", () => {
      // Test the initial todo task list is displaying as we'd expect
      cy.getByTestId("task-list-container").children().should("have.length", 2);

      cy.getByTestId("progress-container").should("be.visible");
      cy.getByTestId("progress-text")
        .first()
        .should("have.text", "4 questions remaining");

      // Test navigation to the task itself
      cy.getByTestId("task-list-container").children().first().click();
      cy.url().should("contain", "/todo/2");

      // The response should get saved
      cy.getByTestId("response").get('input[name="1"]').first().check();
      cy.wait("@saveResponse");

      // Going back to the task list, the progress bar should have updated
      cy.visit("/todo");
      cy.getByTestId("progress-bar").first().should("be.visible");
      cy.getByTestId("progress-bar")
        .first()
        .should("have.attr", "style", "width: 25%;");
      cy.getByTestId("progress-text")
        .first()
        .should("have.text", "3 questions remaining");
    });

    it("should not have any completed tasks", () => {
      cy.visit("/done");

      cy.get("main").should("contain.text", "No completed tasks");
    });

    it("should be able to submit a form", () => {
      cy.getByTestId("task-list-container").children().first().click();

      cy.getByTestId("response").get('input[name="1"]').should("be.checked");

      cy.getByTestId("response").get('input[name="2"]').check();
      cy.wait("@saveResponse");

      cy.getByTestId("response")
        .get('textarea[name="3"]')
        .type("Test response #3", { force: true })
        .blur();
      cy.wait("@saveResponse");

      cy.getByTestId("response")
        .get('textarea[name="4"]')
        .type("Test response #4", { force: true })
        .blur();
      cy.wait("@saveResponse").wait(1000);

      // The progress bar should've updated again - now to 100%!
      cy.visit("/todo");
      cy.getByTestId("progress-text")
        .first()
        .should("have.text", "All questions answered, ready for submission!");
      cy.getByTestId("progress-bar")
        .first()
        .should("have.attr", "style", "width: 100%;");

      // The other task should still be there, but not completed or started
      cy.getByTestId("progress-text")
        .last()
        .should("have.text", "4 questions remaining");
      cy.getByTestId("progress-bar")
        .last()
        .should("have.attr", "style", "width: 0%;");

      cy.intercept("POST", "/api/assessments/2/submissions", (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.equal(200);
        });
      });

      cy.getByTestId("task-list-container").children().first().click();
      cy.get('button[type="submit"]').click({ force: true });

      cy.getByTestId("task-list-container")
        .children()
        .should("have.length", "1");
    });

    it("should now have a completed task", () => {
      cy.visit("/done");

      cy.getByTestId("list-item").should("have.length", "1");

      cy.getByTestId("side-text").and("have.text", "Part 1 of 11");
    });

    it("should be able to finish both tasks", () => {
      cy.getByTestId("task-list-container").children().first().click();

      cy.getByTestId("response").get('input[name="1"]').check();
      cy.wait("@saveResponse");

      cy.getByTestId("response").get('input[name="2"]').check();
      cy.wait("@saveResponse");

      cy.getByTestId("response")
        .get('textarea[name="3"]')
        .type("Test response #3", { force: true })
        .blur();
      cy.wait("@saveResponse");

      cy.getByTestId("response")
        .get('textarea[name="4"]')
        .type("Test response #4", { force: true })
        .blur();
      cy.wait("@saveResponse").wait(1000);

      cy.intercept("POST", "/api/assessments/6/submissions", (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.equal(200);
        });
      });

      cy.get('button[type="submit"]').click({ force: true });

      cy.get("main").should("contain.text", "No tasks! 🎉");

      cy.visit("/done");

      cy.getByTestId("list-item").should("have.length", "2");
    });
  });

  context("Part 2 - Internal", () => {
    beforeEach(() => {
      cy.login("internal@test.net");
      cy.visit("/todo");

      cy.intercept("PUT", "/api/users/2/todos", (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.equal(200);
        });
      }).as("saveResponse");
    });

    it("Should be able to see and interact with their task", () => {
      cy.getByTestId("task-list-container").children().should("have.length", 2);

      cy.getByTestId("task-list-container").children().first().click();
      cy.url().should("contain", "/todo/2");

      cy.intercept("PUT", "/api/assessments/2/responses/*", (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.equal(200);
        });
      }).as("saveResponse");

      cy.get('input:enabled[value="Yes"]').each((el) => {
        cy.wrap(el).check({ force: true }).wait("@saveResponse");
      });
      cy.get("#question-16 textarea")
        .type("Test response", { force: true })
        .blur()
        .wait("@saveResponse");
    });

    it("Should not have any completed tasks", () => {
      cy.visit("/done");

      cy.get("main").should("contain.text", "No completed tasks");
    });
  });
});
