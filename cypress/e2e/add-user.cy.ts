// describe("Add User", () => {
//   beforeEach(() => {
//     cy.intercept("GET", "/api/auth/session", {
//       statusCode: 200,
//       body: {
//         user: {
//           name: "John",
//           email: "admin@example.com",
//           roles: ["module_leader", "ps_team"],
//         },
//         expires: "date-string",
//       },
//     });
//     cy.visit("/ps-team/user-management");
//   });
//   // Add a new user
//   it("allows a ps-team member to add a user", () => {
//     // Can add a user
//     cy.contains("button", "Create New User").click();
//     cy.get('[data-cy="name"]').type("New User");
//     cy.get('[data-cy="email"]').type("newuser@example.com");
//     cy.get('[data-cy="password"]').type("examplepass");
//   });
// });
