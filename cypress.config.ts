import { defineConfig } from "cypress";
import { prismaFindUser, prismaCreateUser } from "./prisma/prismaTestTasks";

export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("@cypress/code-coverage/task")(on, config);

      on("task", {
        prismaFindUser,
        prismaCreateUser,
      });

      return config;
    },
    baseUrl: "http://localhost:3000",
  },
});
