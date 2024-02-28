/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByTestId(id: string): Chainable<JQuery<HTMLElement>>;
  }
  interface Chainable {
    createUserIfNotExists(
      email: string,
      name: string,
      password: string,
      roles?: Role[],
    ): Chainable<Element>;
  }
  interface Chainable {
    login(): Chainable<void>;
  }
}
