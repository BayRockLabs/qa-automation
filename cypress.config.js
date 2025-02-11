const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const mochawesome = require("cypress-mochawesome-reporter/plugin"); // Import the mochawesome plugin

module.exports = defineConfig({
  video: true,
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    setupNodeEvents(on, config) {
      mochawesome(on);
      on("task", {
        readFilesInDirectory(directoryPath) {
          return new Promise((resolve, reject) => {
            fs.readdir(path.join(__dirname, directoryPath), (err, files) => {
              if (err) {
                reject(err);
              } else {
                resolve(files.filter((file) => path.extname(file) === ".json"));
              }
            });
          });
        },
      });
    },
    reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: true,
      html: true,
    },
    baseUrl: "https://c2c-demo.bayrocklabs.com",
    // baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalStudio: true,
    testIsolation: false,
    defaultCommandTimeout: 20000,
    watchForFileChanges: false,
  },
});
