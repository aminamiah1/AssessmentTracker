describe("Add User Form", () => {

    // Visit the user management page
    beforeEach(() => {
      cy.visit("http://localhost:3000/ps-team/user-management");
    });
  
    // Add a new user
    it("allows a ps-team member to add a user", () => {
   
      // Add the new user through the create new user form
      cy.contains('button', 'Create New User').click();
      cy.get('[data-cy="name"]').type("New User"); 
      cy.get('[data-cy="email"]').type("newuser@example.com"); 
      cy.get('[data-cy="password"]').type("examplepass"); 
      cy.get('#react-select-3-input').type('module_leader{enter}{enter}'); 
      cy.intercept("POST", "/api/ps-team/create-users", {
        statusCode: 200,
        body: { name: "New User", email: "newuser@example.com", roles: "module_leader", password: "example"},
      }).as("addUser");
      cy.get('[data-cy="CreateUser"]').click()
      cy.on(".Toastify__toast-body", (str) => {
        expect(str).to.equal(`User added successfully!`);
      });  

      // Delete new user after test
      cy.get('table').should('be.visible').contains('td', 'New User').next().next().click()

    });
  });
  