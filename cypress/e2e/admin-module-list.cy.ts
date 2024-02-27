/// <reference types='cypress' />
describe("Admin module list page", () => {
  // before(() => {
  //   cy.log("Seeding the database...");
  //   cy.exec("npm run db:seed", { timeout: 200000 });
  // });
  // beforeEach(() => {
  //   // Mock the authentication check by intercepting the auth/session call
  //   cy.clearCookies();
  //   cy.clearLocalStorage();
  //   cy.intercept("GET", "**/api/auth/session", (req) => {
  //     req.reply({
  //       body: {
  //         user: {
  //           id: 6,
  //           name: "Admin User",
  //           email: "admin@example.com",
  //           roles: ["ps_team", "module_leader"],
  //         },
  //         expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  //       },
  //     });
  //   });
  //   cy.visit("/admin/module-list");
  // });
  // it("should display the page title", () => {
  //   cy.getByTestId("page-title")
  //     .should("be.visible")
  //     .and("contain", "Module List");
  // });
  // it("should display the search bar", () => {
  //   cy.getByTestId("search-bar").should("be.visible");
  // });
  // it("should show the create module button", () => {
  //   cy.getByTestId("create-module-btn")
  //     .should("be.visible")
  //     .and("contain", "Create Module");
  //   // Will eventually lead to create module page
  // });
  // it("should display the correct data from the database", () => {
  //   cy.get(".module-card")
  //     .first()
  //     .should("contain", "Example Module")
  //     .and("contain", "CM6127");
  // });
  // it("should show all module manage buttons", () => {
  //   cy.get(".module-card > div > button").each((button) => {
  //     cy.wrap(button).should("exist");
  //     cy.wrap(button).click();
  //     cy.wrap(button).should("have.focus");
  //   });
  //   cy.get(".module-card > div > a").each((button) => {
  //     cy.wrap(button).should("exist");
  //     cy.wrap(button).click();
  //     cy.url().should("include", "/admin/module-list/edit/");
  //   });
  //   // These buttons will eventually lead to different pages
  // });
  // it("should show correct modules when search term is entered", () => {
  //   cy.getByTestId("search-bar").type("CM6127{enter}");
  //   cy.get(".module-card")
  //     .should("contain", "Example Module")
  //     .and("have.length", 1);
  //   // will need to change once testing db is setup
  // });
});
