import { login, logout } from "./utils/auth";
import { authenticator } from "otplib";
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


const validateLocalStorage = localStorage =>
  Cypress._.some(localStorage, (value, key) =>
      key.includes('CognitoIdentityServiceProvider'),
  )

Cypress.Commands.add('getTOTP', () => {
  const otp = authenticator.generate(Cypress.env('AZURE_SECRET'))
  return otp
})

Cypress.Commands.add('sessionLogin', (user) => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.loginViaAzureAD(user);
  return cy.visit('/').then(() => {
      cy.pause()
  })
})

Cypress.Commands.add('loginViaAzureAD', (user) => {
  cy.intercept('POST', '**/token').as('getToken');
  cy.origin('https://login.microsoftonline.com/', { args: { user } }, ({ user })  => {
      cy.visit('/')
      cy.get("[id='i0116']").type(user.email);
      cy.get("[id='idSIButton9']").click()
  })

  const organizationURL = Cypress.env("AUTH_BASE_URL") + "/" + Cypress.env("TENANT_ID") + "/password";
  cy.origin(organizationURL, { args: { user }}, ({ user }) => {
      cy.get('#i0118').type(user.password);
      cy.get('#idSIButton9').click();
  })

  cy.getTOTP().then((otp1) => {
      const objOTP = { otp: otp1 }
      cy.origin('https://login.microsoftonline.com/', { args: objOTP }, ({ otp }) => {
          cy.log("otp is", otp)
          cy.get('#idTxtBx_SAOTCC_OTC').type(otp);
          cy.get('#idSubmit_SAOTCC_Continue').click();
          cy.get('#idSIButton9').click();
      })
      cy.wait('@getToken').then((interception) => {
        console.log(interception)
      })
  })
})