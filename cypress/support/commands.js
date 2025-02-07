import { login, logout } from "./utils/auth";
import Papa from "papaparse";

Cypress.Commands.add("login", (user) => {
  return login(user);
});

Cypress.Commands.add("getUserPermissions", (userRoles) => {
  const userRolesFile = "user_roles.csv";

  const environment = Cypress.env("ENVIRONMENT") || "prod";

  if (environment === "demo") {
    userRoles = userRoles.map((role) => role.replace("_demo", ""));
  }

  return cy.fixture(userRolesFile).then((csvContent) => {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          const listOfOperations = [];
          const userPermissions = {};

          data.forEach((row) => {
            listOfOperations.push(row.operation);
            userRoles.forEach((role) => {
              if (!userPermissions[role]) {
                userPermissions[role] = [];
              }
              userPermissions[role].push(row[role]?.toUpperCase() === "TRUE");
            });
          });

          const finalPermissions = {};
          listOfOperations.forEach((operation, index) => {
            finalPermissions[operation] = userRoles.reduce((acc, role) => {
              return acc || userPermissions[role][index];
            }, false);
          });

          finalPermissions.default_user =
            !Object.values(finalPermissions).includes(true);
          finalPermissions.estimation_module =
            finalPermissions.estimation_view || finalPermissions.pricing_view;
          finalPermissions.contract_module =
            finalPermissions.contract_view ||
            finalPermissions.milestone_view ||
            finalPermissions.purchase_order_view;
          finalPermissions.client_management_module =
            finalPermissions.client_view ||
            finalPermissions.estimation_module ||
            finalPermissions.contract_module ||
            finalPermissions.allocation_view ||
            finalPermissions.invoice_view;
          resolve(finalPermissions);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  });
});

Cypress.Commands.add("logout", () => {
  logout();
});

// Cypress.Commands.add('waitForRoleUpdate', (expectedRoles, removal = false, timeout = 20000, interval = 5000) => {
//     const startTime = Date.now();
//     const userCredentials = Cypress.env('USER');
//     const checkRoles = () => {
//         return cy.login(userCredentials).then((userRoles) => {
//             if (!removal && userRoles.includes(expectedRoles)) {
//                 return cy.wrap(true);
//             } else if (removal && userRoles.length === 0) {
//                 return cy.wrap(true);
//             }
//             if (Date.now() - startTime > timeout) {
//                 throw new Error('Roles did not update in time');
//             }
//             cy.wait(interval).then(checkRoles);
//         });
//     };
//     return checkRoles();
// });

// Cypress.Commands.add('getUserRoles', () => {
//     cy.window().its('localStorage').then((localStorage) => {
//         return JSON.parse(localStorage.getItem('userData')).user_roles;
//     })
// })
