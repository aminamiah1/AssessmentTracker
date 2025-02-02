// From https://docs.cypress.io/api/commands/mount
import { mount } from "cypress/react18";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      mountNoCache: typeof mount;
      mountWithPart: typeof mount;
    }
  }
}
