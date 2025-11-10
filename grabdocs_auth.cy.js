// cypress/e2e/grabdocs_auth.cy.js
describe('GrabDocs authentication', () => {
  it('logs into GrabDocs successfully', () => {
    const EMAIL = Cypress.env('EMAIL') || 'your@email.com';
    const PASS = Cypress.env('PASSWORD') || 'YourPassword123!';

    cy.visit('https://grabdocs.com', { timeout: 60000 });

    // Click Sign In — be aggressive with selectors
    cy.contains(/Sign in|Log in/i, { timeout: 20000 }).click({ force: true });

    // Switch to app.grabdocs.com for login
    cy.origin('https://app.grabdocs.com', { args: { EMAIL, PASS } }, ({ EMAIL, PASS }) => {
      // Wait for login page to load
      cy.location('pathname', { timeout: 30000 }).should('match', /login|signin/i);

      // Fill credentials
      cy.get('input[type="email"], input[name="email"]').first().type(EMAIL);
      cy.get('input[type="password"], input[name="password"]').first().type(PASS, { log: false });
      cy.contains(/Sign in|Log in/i).click();

      // Verify login succeeded
      cy.contains(/Documents|Dashboard|New Document/i, { timeout: 60000 }).should('be.visible');
    });
  });
});

