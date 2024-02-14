import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 20000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("@cypress/code-coverage/task")(on, config);

      return config;
    },
    baseUrl: "http://localhost:3000",
  },
});
