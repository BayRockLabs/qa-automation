import { login } from 'cypress/support/utils/auth'
import Papa from 'papaparse';
import { assignRole, removeRole } from 'cypress/support/utils/roleManagement';


Cypress.Commands.add('login', (user) => {
    return login(user);
});

Cypress.Commands.add('getUserRoles', (userRoles) => {
    const userRolesFile = 'user_roles.csv';

    /*
        Check the environment and remove  '_demo' from the role names if in 
        demo environment
    */
    const environment = Cypress.env('environment') || 'prod';
    if (environment === 'demo') {
        userRoles = userRoles.map(role => role.replace('_demo', ''));
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
                            userPermissions[role].push(row[role]?.toUpperCase() === 'TRUE');
                        });
                    });

                    const finalPermissions = {};
                    listOfOperations.forEach((operation, index) => {
                        finalPermissions[operation] = userRoles.reduce((acc, role) => {
                            return acc || userPermissions[role][index];
                        }, false);
                    });

                    
                    finalPermissions.default_user = !(Object.values(finalPermissions).includes(true));
                    finalPermissions.estimation_module = finalPermissions.estimation_view || 
                                                         finalPermissions.pricing_view;
                    finalPermissions.contract_module = finalPermissions.contract_view ||
                                                       finalPermissions.milestone_view ||
                                                       finalPermissions.purchase_order_view;
                    cy.wrap(finalPermissions).as('userPermissions');
                    resolve(finalPermissions);
                },
                error: (err) => {
                    reject(err);
                },
            });
        });
    });
});


Cypress.Commands.add('clearSessionData', () => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
});

Cypress.Commands.add('assignUserRole', (userEmail, userRole) => {
    assignRole(userEmail, userRole);
})

Cypress.Commands.add('removeUserRole', (userEmail, userRole) => {
    removeRole(userEmail, userRole);
})