import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("@cypress/code-coverage/task")(on, config);

      return config;
    },
    baseUrl: "http://localhost:1234",
  },
});
