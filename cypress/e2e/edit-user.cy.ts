// describe("Edit User", () => {
//   beforeEach(() => {
//     cy.intercept("GET", "**/api/auth/session", {
//       statusCode: 200,
//       body: {
//         user: {
//           name: "Admin User",
//           email: "admin@example.com",
//           role: "ps_team",
//         },
//         expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Expires in 2 hours
//       },
//     }).as("getSession");

//     cy.visit("/ps-team/user-management");

//     // Wait for the mock session to ensure the user is "logged in"
//     cy.wait("@getSession");
//   });

//   it("allows a ps-team member to edit a user", () => {
//     cy.contains("button", "Edit").click();
//     cy.get('[data-cy="name"]').clear().type("New User Test");
//     cy.get('[data-cy="email"]').clear().type("newusertest@example.com");
//     cy.get('[data-cy="password"]').clear().type("examplepass");
//   });
// });
