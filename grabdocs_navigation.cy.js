// cypress/e2e/grabdocs_navigation.cy.js

// Goal: Prove that the main navigation links (Features, Pricing, Contact) work.

describe('GrabDocs navigation', () => {
  it('navigates between main pages (Features, Pricing, Contact)', () => {
    cy.visit('https://grabdocs.com');

    // FEATURES
    cy.get('a[href*="/features"]', { timeout: 10000 })
      .first()
      .click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('include', '/features');
    cy.scrollTo('bottom');
    cy.wait(1000);

    // PRICING
    cy.get('a[href*="/pricing"]', { timeout: 10000 })
      .first()
      .click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('include', '/pricing');
    cy.scrollTo('bottom');
    cy.wait(1000);

    // CONTACT (only if it exists)
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/contact"]').length) {
        cy.get('a[href*="/contact"]', { timeout: 10000 })
          .first()
          .click({ force: true });
        cy.location('pathname', { timeout: 10000 }).should('include', '/contact');
        cy.contains(/Contact|Support|Email/i, { timeout: 10000 }).should('be.visible');
      }
    });
  });

  it('opens Features and Pricing from the homepage using hrefs directly', () => {
    // 1) Open homepage
    cy.visit('https://grabdocs.com/');

    // 2) FEATURES: read href then visit it
    cy.get('a[href*="/features"]', { timeout: 10000 })
      .first()
      .should('have.attr', 'href')
      .then((href) => {
        const url = href.startsWith('http') ? href : `https://grabdocs.com${href}`;
        cy.visit(url);
      });

    // 3) Confirm /features loaded
    cy.location('pathname', { timeout: 10000 }).should('include', '/features');

    // 4) Back to homepage
    cy.go('back');
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');

    // 5) PRICING: same pattern
    cy.get('a[href*="/pricing"]', { timeout: 10000 })
      .first()
      .should('have.attr', 'href')
      .then((href) => {
        const url = href.startsWith('http') ? href : `https://grabdocs.com${href}`;
        cy.visit(url);
      });

    // 6) Confirm /pricing loaded and content is present
    cy.location('pathname', { timeout: 10000 }).should('include', '/pricing');
    cy.contains(/Free|Premium|Pricing/i, { timeout: 10000 }).should('be.visible');
  });
});

