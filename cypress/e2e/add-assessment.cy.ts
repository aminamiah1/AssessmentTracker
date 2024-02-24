// describe("Add Assessment Form", () => {
//   // Visit the add assessment form
//   beforeEach(() => {
//     cy.intercept("GET", "/api/auth/session", {
//         statusCode: 200,
//         body: {
//           user: { name: "John", email: "admin@example.com", roles: ["ps_team", "module_leader"]},
//           expires: "date-string",
//         },
//       });
//       cy.visit("/module-leader/assessment-management");
//       cy.clearCookies();
//       cy.clearLocalStorage();
//       cy.intercept("GET", "**/api/auth/session", (req) => {
//         req.reply({
//           body: {
//             user: {
//               id: 6,
//               name: "Admin User",
//               email: "admin@example.com",
//               roles: ["ps_team", "module_leader"],
//             },
//             expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
//           },
//         });
//       }).as("getSession");
//     cy.visit(
//       "http://localhost:3000/module-leader/assessment-management/create-assessment",
//     );
//   });

//   // Add a new assessment test
//   it("allows a module leader to add a assessment", () => {
//     // Add the new assessment through the create new assessment form
//     cy.get('[data-cy="name"]').type("New Assessment");
//     cy.get('[data-cy="type"]').type("Test");
//     cy.get("[id^=react-select-5-input]").type("{enter}{enter}");

//     cy.intercept("POST", "/api/module-leader/create-assessment", {
//       statusCode: 200,
//       body: {
//         assessment_name: "New Assessment",
//         assessment_type: "Test",
//       },
//     }).as("addAssessment");

//     // Return to the assessment management landing page after adding
//     cy.get(".arrowReturn").click({ force: true });
//   });
// });
