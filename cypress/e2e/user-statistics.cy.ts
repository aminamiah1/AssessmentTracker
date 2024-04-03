/// <reference types='cypress' />
describe("User Statistics", () => {
  beforeEach(() => {
    cy.login("ps@test.net");
  });

  it("should allow user statistics to be shown", () => {
    cy.visit("/ps-team/analytics/user-statistics");

    cy.contains(
      "h1",
      "Top 5 most assigned users by number of assigned assessments",
    ).should(
      "have.text",
      "Top 5 most assigned users by number of assigned assessments",
    );
  });
});
