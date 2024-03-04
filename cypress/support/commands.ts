/// <reference types="cypress" />

import { mount } from "cypress/react18";
import { SessionProvider } from "next-auth/react";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/**
 * Accesses HTML Elements using data-cy tag instead of using
 * className or id.
 * @param {string} id - The test id given to a HTML Element, must be unique.
 */
Cypress.Commands.add("getByTestId", (id: string) => {
  return cy.get(`[data-cy="${id}"]`);
});

/**
 * Command to create a new user in the database if they do not exist for edit user test
 */
Cypress.Commands.add(
  "createUserIfNotExists",
  (email, name, password, roles = []) => {
    cy.task("prismaCreateUser", { email, name, password, roles });
  },
);

Cypress.Commands.add("login", () => {
  cy.visit("/api/auth/signin");
  cy.get("#input-email-for-credentials-provider").type("testemail@test.net");
  cy.get("#input-password-for-credentials-provider").type("securepassword");
  cy.get("button").click();
});

// Mock login used in older tests to enable testing without database
Cypress.Commands.add("mockLogin", () => {
  cy.intercept("GET", "/api/auth/session", {
    statusCode: 200,
    body: {
      user: {
        name: "John",
        email: "admin@example.com",
        roles: ["ps_team", "module_leader"],
      },
      expires: "date-string",
    },
  });
  cy.visit("/module-leader/assessment-management");
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept("GET", "**/api/auth/session", (req) => {
    req.reply({
      body: {
        user: {
          id: 6,
          name: "Admin User",
          email: "admin@example.com",
          roles: ["ps_team", "module_leader"],
        },
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
    });
  }).as("getSession");
});

Cypress.Commands.add("mount", (component, options) => {
  return mount(component, options);
});
