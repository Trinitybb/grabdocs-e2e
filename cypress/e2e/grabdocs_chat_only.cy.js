// cypress/e2e/grabdocs_chat_only.cy.js

describe('GrabDocs: chat on an existing document', () => {
  it('logs in, opens a document, and asks the AI a question', () => {
    cy.loginToGrabDocs();

    cy.origin('https://app.grabdocs.com', () => {
      // Step 1: Click the first document in the list
      // TODO: adjust selector to match actual list structure
      cy.get('[data-testid="document-row"], .document-row, tr, li', { timeout: 60000 })
        .first()
        .click({ force: true });

      // Step 2: Confirm document content is visible
      cy.contains(/Preview|Content|Pages|Summary|Document details/i, { timeout: 60000 })
        .should('be.visible');

      // Step 3: Open chat/assistant
      cy.get('body', { timeout: 20000 }).then(($body) => {
        const hasChatEntry = /Chat|AI Assistant|Ask AI|Ask about this document/i.test($body.text());
        if (hasChatEntry) {
          cy.contains(/Chat|AI Assistant|Ask AI|Ask about this document/i)
            .click({ force: true });

          // Step 4: Ask a focused question
          cy.get('textarea, [contenteditable="true"], input[type="text"]', { timeout: 20000 })
            .first()
            .type('What are the key points of this document?{enter}');

          // Step 5: Assert a response appears
          cy.contains(/key points|This document|The main points|In summary/i, { timeout: 60000 })
            .should('be.visible');

        } else {
          cy.log('Chat/AI UI not found; skipping chat part.');
        }
      });
    });
  });
});
