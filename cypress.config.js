const { defineConfig } = require("Cypress");
 

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://c2c-demo.bayrocklabs.com", // Set base URL for your application under test
    chromeWebSecurity: false, // Disable chrome web security to handle cross-origin issues
    experimentalModifyObstructiveThirdPartyCode : true,
    experimentalStudio: true,
    testIsolation: false,
    defaultCommandTimeout : 20000,
    watchForFileChanges: false,
  },
});

