describe('GrabDocs navigation placeholder', () => {
  it('checks links exist', () => {
    cy.visit('https://grabdocs.com/');
    cy.get('a[href*="/features"]').should('exist');
    cy.get('a[href*="/pricing"]').should('exist');
  });
});
