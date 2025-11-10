const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
   chromeWebSecurity: false,        // 🔓 allows cross-origin iframes
    experimentalSessionAndOrigin: true, 
    setupNodeEvents(on, config) {
      // inject login credentials here
      config.env = {
        EMAIL: "purpooh6@gmail.com",
        PASSWORD: "purpooh06",
        OTP: "", // leave blank unless you use 2FA
      };
      return config;
    },
  },
});

