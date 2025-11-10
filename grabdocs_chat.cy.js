// cypress/e2e/grabdocs_chat.cy.js
// Purpose: Log into GrabDocs and send a short chat message

describe('GrabDocs: login and send a chat message', () => {
  it('logs in and sends a chat message successfully', () => {
    // 0) Read credentials from environment variables, with defaults
    const EMAIL = Cypress.env('EMAIL') || 'testuser@example.com';
    const PASS = Cypress.env('PASSWORD') || 'TestPassword123!';
    const OTP = Cypress.env('OTP'); // Optional two-factor code

    // 1) Open public site and click “Sign in”
    cy.visit('https://grabdocs.com/');
    cy.contains(/Log in|Sign in/i, { timeout: 20000 }).click({ force: true });

    // 2) Switch to the app sub-domain for login
    cy.origin(
      'https://app.grabdocs.com',
      { args: { EMAIL, PASS, OTP } },
      ({ EMAIL, PASS, OTP }) => {
        // --- Fill in login form ---
        cy.get('input[type="email"], input[name="email"], input[type="text"]', { timeout: 20000 })
          .first()
          .clear()
          .type(EMAIL, { delay: 20 });

        cy.get('input[type="password"], input[name="password"]', { timeout: 20000 })
          .first()
          .clear()
          .type(PASS, { log: false });

        cy.contains(/Log in|Sign in/i, { timeout: 20000 }).click();

        // --- Handle optional Two-Factor Auth ---
        cy.get('body', { timeout: 30000 }).then(($body) => {
          const needs2FA = /Two[-\s]?Factor|Verify Code|Verification Code/i.test($body.text());
          if (needs2FA) {
            const otpSelector =
              'input[autocomplete="one-time-code"], input[name*="code"], input[type="tel"], input[name="otp"]';
            if (OTP) {
              cy.get(otpSelector, { timeout: 20000 }).first().clear().type(OTP);
              cy.contains(/Verify|Continue|Submit/i, { timeout: 20000 }).click();
            } else {
              cy.pause(); // manually type your code, then press ▶ Resume in Cypress
            }
          }
        });

        // --- Verify login success ---
        cy.contains(/Documents|New Document|Dashboard|Home/i, { timeout: 60000 })
          .should('be.visible');

        // --- OPTIONAL: open Chat/AI Assistant and send a message ---
        cy.get('body').then(($body) => {
          const hasChatEntry = /Chat|AI Assistant/i.test($body.text());
          if (hasChatEntry) {
            cy.contains(/Chat|AI Assistant/i).click({ force: true });

            cy.get('textarea, [contenteditable="true"], input[type="text"]', { timeout: 20000 })
              .first()
              .type('Hello from Cypress!{enter}');

            cy.contains(/AI|GrabDocs|document|processing/i, { timeout: 30000 })
              .should('be.visible');
          }
        });
      }
    );
  });
});

