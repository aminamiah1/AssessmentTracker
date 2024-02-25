/// <reference types='cypress' />
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Admin module edit page", () => {
  beforeEach(() => {
    cy.visit("/admin/module-list");

    prisma.module.createMany();
  });
});
