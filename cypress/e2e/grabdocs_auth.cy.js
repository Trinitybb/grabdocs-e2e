describe('GrabDocs authentication test', () => {
  it('opens GrabDocs homepage', () => {
    cy.visit('https://grabdocs.com/');
    cy.contains(/Log in|Sign in/i).should('exist');
  });
});
