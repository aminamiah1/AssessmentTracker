// /// <reference types='cypress' />
// describe("Admin module list page", () => {
//   const mockData = [
//     {
//       id: 1,
//       module_name: "Example Module 1",
//       module_code: "CM6124",
//     },
//     {
//       id: 2,
//       module_name: "Example Module 2",
//       module_code: "CM6123",
//     },
//     {
//       id: 3,
//       module_name: "Example Module 3",
//       module_code: "CM6126",
//     },
//     {
//       id: 4,
//       module_name: "Example Module 4",
//       module_code: "CM6127",
//     },
//   ];

//   beforeEach(() => {
//     // Mock the authentication check by intercepting the auth/session call
//     cy.clearCookies();
//     cy.clearLocalStorage();
//     cy.intercept("GET", "**/api/auth/session", (req) => {
//       req.reply({
//         body: {
//           user: {
//             id: 6,
//             name: "Admin User",
//             email: "admin@example.com",
//             roles: ["ps_team", "module_leader"],
//           },
//           expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
//         },
//       });
//     }).as("getSession");

//     cy.visit("/admin/module-list");

//     // Wait for the mock session to ensure the user is "logged in"
//     cy.wait("@getSession");
//   });

//   it("should display the page title", () => {
//     cy.getByTestId("page-title")
//       .should("be.visible")
//       .and("contain", "Module List");
//   });

//   it("should display the search bar", () => {
//     cy.getByTestId("search-bar").should("be.visible");
//   });

//   it("should show the create module button", () => {
//     cy.getByTestId("create-module-btn")
//       .should("be.visible")
//       .and("contain", "Create Module");
//      Will eventually lead to create module page
//   });

//   it("should display the correct data from the database", () => {
//    cy.intercept("GET", "/api/module-list", (req) => {
//        req.reply(mockData);
//      });

//      cy.get(".module-card")
//        .first()
//        .should("contain", "Example Module 1")
//       .and("contain", "CM6124");
//    });

//   it("should show all module manage buttons", () => {
//      cy.intercept("GET", "/api/module-list", (req) => {
//       req.reply(mockData);
//     });

//      cy.get(".module-card > div > button").each((button) => {
//        cy.wrap(button).should("exist");
//        cy.wrap(button).click();
//       cy.wrap(button).should("have.focus");
//     });

//     cy.get(".module-card > div > button").should("have.length", 8);
//     These buttons will eventually lead to different pages
//    });

//    it("should show correct modules when search term is entered", () => {
//      cy.intercept("GET", "/api/module-list/CM6124", (req) => {
//       req.reply([mockData[0]]);
//      });
//      cy.getByTestId("search-bar").type("CM6124{enter}");
//     cy.get(".module-card")
//        .should("contain", "Example Module 1")
//        .and("have.length", 1);
//       will need to change once testing db is setup
//    });

//   This throws errors because module.map in admin/module-list/page/tsx doesnt exist
// });
