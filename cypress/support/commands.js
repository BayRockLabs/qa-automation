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


Cypress.Commands.add('getTOTP', () => {
  const otp = authenticator.generate(Cypress.env('AZURE_SECRET'))
  return otp
})


function loginViaAAD(user) {
  const username = user.email;
  const password = user.password;

  cy.visit('/login')
  cy.get('p').contains('Login with Microsoft').click()

  // Login to your AAD tenant.
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        username,
        password
      },
    },
    ({ username, password }) => {
      cy.get("[id='i0116']").type(username, {
        log: false,
      })
      cy.get("[id='idSIButton9']").click()
      cy.get('#i0118').type(password, {
        log: false,
      })
      cy.get('#idSIButton9').click()
    }
  )

cy.getTOTP().then((otp) => {
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        otp
      },
    },
    ({ otp }) => {
      cy.get('#idTxtBx_SAOTCC_OTC').type(otp);
      cy.get('#idSubmit_SAOTCC_Continue').click();
      cy.get('#idSIButton9').click();
    }
  )
})
}

Cypress.Commands.add('loginToAAD', (user) => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  const log = Cypress.log({
    displayName: 'Azure Active Directory Login',
    message: [`🔐 Authenticating | ${user.email}`],
    autoEnd: false,
  })
  log.snapshot('before')

  loginViaAAD(user)

  log.snapshot('after')
  log.end()
})