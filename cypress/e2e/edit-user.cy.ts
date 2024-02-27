describe("Edit User Form", () => {
  // before(() => {
  //   cy.log("Seeding the database...");
  //   cy.exec("npm run db:seed", { timeout: 200000 });
  // });
  // // Visit the user management page
  // beforeEach(() => {
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
  //   cy.visit("/ps-team/user-management");
  // });
  // //Edit a user
  // it("allows a ps-team member to  edit a user", () => {
  //   // Can edit a user
  //   cy.contains("button", "Edit").click();
  //   cy.getByTestId("name").type("New User Test");
  //   cy.getByTestId("email").type("newusertest@example.com");
  //   cy.getByTestId("password").type("examplepass");
  // });
});
