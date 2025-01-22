const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here//-
      on('task', {
        readFilesInDirectory(directoryPath) {
          return new Promise((resolve, reject) => {
            fs.readdir(path.join(__dirname, directoryPath), (err, files) => {
              if (err) {
                reject(err);
              } else {
                resolve(files.filter(file => path.extname(file) === '.json'));
              }
            });
          });
        },
      });
    },
    baseUrl: "https://localhost:3000", 
    chromeWebSecurity: false, 
    experimentalModifyObstructiveThirdPartyCode : true,
    experimentalStudio: true,
    testIsolation: false,
    defaultCommandTimeout : 20000,
    watchForFileChanges: false,
  },
});

