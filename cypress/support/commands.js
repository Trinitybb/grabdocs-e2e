// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// cypress/support/commands.js

// Helper to log into GrabDocs
Cypress.Commands.add('loginToGrabDocs', () => {
  const EMAIL = Cypress.env('EMAIL') || 'purpooh06@gmail.com';
  const PASS  = Cypress.env('PASSWORD') || 'purpooh06';
  const OTP   = Cypress.env('OTP');

  cy.visit('https://grabdocs.com/', { timeout: 60000 });
  cy.contains(/Log in|Sign in/i, { timeout: 20000 }).click({ force: true });

  cy.origin('https://app.grabdocs.com', { args: { EMAIL, PASS, OTP } }, ({ EMAIL, PASS, OTP }) => {
    cy.location('pathname', { timeout: 30000 }).should('match', /login|signin/i);
    cy.get('input[type="email"], input[name="email"]').first().type(EMAIL);
    cy.get('input[type="password"], input[name="password"]').first().type(PASS, { log: false });
    cy.contains(/Log in|Sign in/i).click();

    cy.contains(/Documents|New Document|Dashboard|Home/i, { timeout: 60000 }).should('be.visible');
  });
});
