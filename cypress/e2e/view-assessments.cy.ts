describe("View assessments", () => {
  // Module leader logging in
  beforeEach(() => {
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

  // Pass if they can view assessments
  it("allows a module leader to add a assessment", () => {
    // By visting the view assessments page
    cy.visit("/module-leader/assessment-management/view-assessments");
  });
});
