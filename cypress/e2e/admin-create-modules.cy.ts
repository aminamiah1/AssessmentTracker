describe("Create Module Form", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
  });

  it("validates module code format", () => {
    cy.visit("/admin/module-list/create");
    cy.get('input[name="moduleCode"]').type("WrongFormat");
    cy.get("form").submit();
    cy.get("div.text-red-600").should(
      "contain",
      "Module code must be two letters followed by four numbers.",
    );
  });

  it("successfully creates a module", () => {
    cy.visit("/admin/module-list/create");
    cy.get('input[name="moduleName"]').type("Introduction to Testing");
    cy.get('input[name="moduleCode"]').type("IT1234");
    cy.get(".basic-multi-select").click();
    cy.get(".select__option").contains("Module Leader").click();
    cy.get("form").submit();
    cy.get("div.text-green-600").should(
      "contain",
      "Module successfully created.",
    );
  });
});
