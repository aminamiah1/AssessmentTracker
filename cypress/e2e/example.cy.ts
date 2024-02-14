describe("ts-example", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should run example test", () => {
    expect(true).to.be.true;
  });
});
