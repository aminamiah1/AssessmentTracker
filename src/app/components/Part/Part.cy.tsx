import { FormEvent } from "react";
import { Part } from "./Part";
import importedPart from "./parts.json";

const part: PartWithQuestionsAndResponses =
  importedPart as PartWithQuestionsAndResponses;

const defaults = {
  part,
  assessmentId: 0,
  afterSubmit: (e: FormEvent<HTMLFormElement>) => {
    console.log("Navigating to:", "/todo");
  },
};

describe("<Part />", () => {
  it("mounts", () => {
    cy.mount(<Part {...defaults} />);
  });

  context("Visuals", () => {
    it("displays the part name", () => {
      cy.mount(<Part {...defaults} />);
      cy.get("h1").first().contains("Test").should("be.visible");
    });

    it("displays the correct number of questions", () => {
      cy.mount(<Part {...defaults} />);
      cy.get(".question").should("have.length", part.Question.length);
    });
  });

  context("Functionality", () => {
    it("submits the form when the submit button is clicked", () => {
      cy.intercept("POST", "/api/assessments/0/submissions", {
        statusCode: 200,
      }).as("submitPart");

      cy.intercept("PUT", "/api/assessments/0/responses/*", {
        statusCode: 200,
      }).as("saveResponse");

      cy.mount(<Part {...defaults} />);

      cy.get("textarea").type("response").blur();
      cy.get("textarea").wait("@saveResponse");
      cy.get('input[type="radio"]').first().check().wait("@saveResponse");
      cy.get("select").select(3).wait("@saveResponse");

      cy.spy(console, "log");

      cy.get('button[type="submit"]').click();

      cy.wait("@submitPart").then(() => {
        expect(console.log).to.have.been.calledWith("Navigating to:", "/todo");
      });
    });

    it("doesn't submit the form when the user presses 'submit' with missing responses", () => {
      cy.intercept("POST", "/api/assessments/*/submissions").as("submitPart");

      cy.mount(<Part {...defaults} />);

      // We don't want to see a POST request - an error should be thrown
      // by the `cy.wait("@submitPart")` below if it times out, and this
      // handler should catch it
      cy.on("fail", (err) => {
        expect(err.message).to.include("Timed out retrying");
      });

      cy.get('button[type="submit"]').click();

      cy.wait("@submitPart", { timeout: 2000 });
    });

    it("disables all inputs in read-only mode", () => {
      cy.mount(<Part {...defaults} readonly />);

      cy.get("textarea").should("be.disabled");
      cy.get('input[type="radio"]').should("be.disabled");
      cy.get("select").should("be.disabled");
      cy.get('button[type="submit"]').should("not.exist");
    });
  });
});
