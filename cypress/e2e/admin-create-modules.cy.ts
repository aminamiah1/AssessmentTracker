describe("Create Module Form", () => {
  beforeEach(() => {
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
    cy.visit("/admin/module-list/create");
    cy.intercept("GET", "/api/module-leader/get-module-leaders", {
      fixture: "example.json",
    }).as("getModuleLeaders");
    cy.intercept("POST", "/api/module-list/create-modules", {
      statusCode: 200,
      body: {
        message: "Module successfully created.",
      },
    }).as("createModule");
  });

  it("validates module code format", () => {
    cy.get('input[name="moduleCode"]').type("WrongFormat");
    cy.get("form").submit();
    cy.get("div.text-red-600").should(
      "contain",
      "Module code must be two letters followed by four numbers.",
    );
  });

  it("successfully creates a module", () => {
    cy.wait("@getModuleLeaders");
    cy.get('input[name="moduleName"]').type("Introduction to Testing");
    cy.get('input[name="moduleCode"]').type("IT1234");
    cy.get(".basic-multi-select").click();
    cy.get(".select__option").contains("John Doe").click();
    cy.get("form").submit();
    cy.wait("@createModule");
    cy.get("div.text-green-600").should(
      "contain",
      "Module successfully created.",
    );
  });
});
