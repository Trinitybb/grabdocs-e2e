// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// cypress/support/e2e.js
// This file runs automatically before your test files

// ✅ Load custom commands (where loginToGrabDocs is defined)
import './commands';

// ✅ Enable file upload support globally
import 'cypress-file-upload';

// (Optional) ignore frontend errors so Cypress doesn’t crash
Cypress.on('uncaught:exception', (err) => {
  if (/postMessage|Cannot read properties of null/i.test(err.message)) {
    return false;
  }
});

