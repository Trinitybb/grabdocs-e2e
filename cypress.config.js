const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  projectId: 'wrfenz',
  e2e: {
    baseUrl: 'https://grabdocs.com',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    env: {
      EMAIL: process.env.CYPRESS_EMAIL,
      PASSWORD: process.env.CYPRESS_PASSWORD,
      OTP: process.env.CYPRESS_OTP
    },
    setupNodeEvents(on, config) {
      // you can modify config here if needed
      return config;
    },
  },
});

