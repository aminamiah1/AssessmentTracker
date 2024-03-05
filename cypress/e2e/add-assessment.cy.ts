describe("Add a assessment", () => {
  before(() => {
    cy.log("Seeding the database...");
    cy.exec("npm run db:seed", { timeout: 200000 });
  });
  // Module leader logging in
  beforeEach(() => {
    cy.viewport(1280, 1000);
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

  // Pass if they can add a assessment's details
  it("allows a module leader to add a assessment", () => {
    // By visting the create assessments page and typing out the details
    cy.visit("/module-leader/assessment-management/create-assessment");

    // Spoof getting users by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/users/get", {
      fixture: "users.json",
    }).as("getAssignees");

    // Spoof getting modules by retrieving them from example JSON
    cy.intercept("GET", "/api/module-leader/modules/get?id=6", {
      fixture: "modules.json",
    }).as("getModules");

    // Enter test assessment form data
    cy.get('[data-cy="name"]').type("New Assessment");

    cy.contains("label", "Module")
      .next()
      .find("input")
      .focus()
      .type("Computing basics 1{enter}");

    cy.get('[data-cy="type"]').type("Test");

    cy.contains("label", "Assignees")
      .next()
      .find("input")
      .focus()
      .type("Carol White{enter}");
  });
});
