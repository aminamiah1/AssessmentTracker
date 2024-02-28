/// <reference types="cypress" />

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
