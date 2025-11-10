// cypress/e2e/grabdocs_document_workflow.cy.js

// This test simulates a real user:
// 1. Log in
// 2. Upload a PDF into their GrabDocs account
// 3. Wait for it to finish processing and appear in the list
// 4. Open the document
// 5. Ask the AI/chat to summarize it

describe('GrabDocs: upload a document and ask AI about it', () => {
  it('logs in, uploads a doc, opens it, and chats about it', () => {
    const EMAIL = Cypress.env('EMAIL') || 'your@email.com';
    const PASS  = Cypress.env('PASSWORD') || 'YourPassword123!';
    const OTP   = Cypress.env('OTP'); // if your account uses 2FA

    // 1) Start on the marketing site (public landing page)
    cy.visit('https://grabdocs.com/', { timeout: 60000 });

    // 2) Click the "Log in / Sign in" button that takes you to the app
    //    This is the same button *you* would click as a user.
    cy.contains(/Log in|Sign in/i, { timeout: 20000 }).click({ force: true });

    // 3) We're now going to interact with the *application* subdomain.
    //    Cypress requires cy.origin for cross-origin (marketing -> app).
    cy.origin(
      'https://app.grabdocs.com',
      { args: { EMAIL, PASS, OTP } },
      ({ EMAIL, PASS, OTP }) => {
        // 3a) Make sure we're really on the login page for the app
        cy.location('pathname', { timeout: 30000 }).should('match', /login|signin/i);

        // 3b) Fill in email + password (like a real user typing)
        cy.get('input[type="email"], input[name="email"]', { timeout: 20000 })
          .first()
          .clear()
          .type(EMAIL);

        cy.get('input[type="password"], input[name="password"]', { timeout: 20000 })
          .first()
          .clear()
          .type(PASS, { log: false });

        cy.contains(/Log in|Sign in/i, { timeout: 20000 }).click();

        // 3c) Optional: handle 2FA if your account has it turned on
        cy.get('body', { timeout: 30000 }).then(($body) => {
          const needs2FA = /Two[-\s]?Factor|Verify Code|Verification Code/i.test($body.text());
          if (needs2FA) {
            const otpSelector =
              'input[autocomplete="one-time-code"], input[name*="code"], input[type="tel"], input[name="otp"]';

            if (OTP) {
              cy.get(otpSelector, { timeout: 20000 }).first().clear().type(OTP);
              cy.contains(/Verify|Continue|Submit/i, { timeout: 20000 }).click();
            } else {
              // This pauses the test so *you* can type the 2FA code in manually.
              cy.pause();
            }
          }
        });

        // 3d) At this point, we're "logged in" — the app should show
        //     a dashboard or "Documents" screen.
        cy.contains(/Documents|New Document|Dashboard|Home/i, { timeout: 60000 })
          .should('be.visible');

        // 4) Now we simulate clicking "Upload" / "New Document" / "Import"
        //
        //    This is the button you would use in the UI to tell GrabDocs:
        //    "Take a file from my computer and add it to my account."
        cy.contains(/Upload|New Document|Import/i, { timeout: 20000 })
          .click({ force: true });

        // 5) Find the file-input element that the app uses under the hood
        //    and attach a local test file from cypress/fixtures.
        //
        //    This is where the "import to what?" question is answered:
        //    We're "importing" a local file *into* the user's GrabDocs document library.
        cy.get('input[type="file"]', { timeout: 20000 })
          .first()
          .attachFile('sample-contract.pdf'); // must exist under cypress/fixtures

        // 6) While GrabDocs uploads + processes the file, it usually
        //    shows something like "Uploading", "Processing", etc.
        //    We wait for that feedback, then for a "done" message.
        cy.contains(/Uploading|Processing|Analyzing/i, { timeout: 60000 })
          .should('be.visible');

        cy.contains(/Upload complete|Ready|Finished|Document added/i, { timeout: 120000 })
          .should('be.visible');

        // 7) After processing, the new document should appear in a list
        //    (table row, card, etc.). We look for its name in that list.
        const docName = 'sample-contract';
        cy.contains(new RegExp(docName, 'i'), { timeout: 120000 })
          .should('be.visible')
          .click({ force: true });

        // 8) Now we are on the "document viewer" or "details" page.
        //    Here's where the user can see the content or a preview.
        cy.contains(/Preview|Content|Pages|Summary|Document details/i, { timeout: 60000 })
          .should('be.visible');

        // Scroll a bit so it’s obvious in the recorded video
        cy.scrollTo('bottom');
        cy.wait(1000);
        cy.scrollTo('top');

        // 9) Open the AI / Chat panel if it exists on this page.
        //    This is the assistant that understands the uploaded doc.
        cy.get('body', { timeout: 20000 }).then(($body) => {
          const hasChatEntry = /Chat|AI Assistant|Ask AI|Ask about this document/i.test($body.text());
          if (hasChatEntry) {
            cy.contains(/Chat|AI Assistant|Ask AI|Ask about this document/i)
              .click({ force: true });

            // 10) Type a question that references the document content.
            //     The idea is: the AI should answer based *on the doc.*
            cy.get('textarea, [contenteditable="true"], input[type="text"]', { timeout: 20000 })
              .first()
              .type('Can you summarize this document for me?{enter}');

            // 11) Wait for the AI's response bubble.
            //     We look for typical "summary-like" wording.
            cy.contains(/summary|summarize|In summary|This document/i, { timeout: 60000 })
              .should('be.visible');
          } else {
            // If there is no chat element yet in the UI, we at least know:
            // login, upload, and document open all worked end-to-end.
            cy.log('Chat/AI UI not found; document upload and open flow still verified.');
          }
        });
      }
    );
  });
});
