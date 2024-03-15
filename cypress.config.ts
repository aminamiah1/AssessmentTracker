import { defineConfig } from "cypress";
import { prismaCreateUser } from "./prisma/prismaTestTasks";

export default defineConfig({
  defaultCommandTimeout: 10000,
  component: {
    devServer: {
      bundler: "webpack",
      framework: "next",
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        prismaCreateUser,
      });

      return config;
    },
    baseUrl: "http://localhost:3001",
  },
});
