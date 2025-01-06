import { login } from './utils/auth'
import Papa from 'papaparse';


Cypress.Commands.add('login', (user) => {
    return login(user);
});

// Cypress.Commands.add('getUserRoles', (userRoles) => {
//     const userRolesFile = 'user_roles.csv';
//     return cy.fixture(userRolesFile).then((csvContent) => {
//         return new Promise((resolve, reject) => {
//             Papa.parse(csvContent, {
//                 header: true,
//                 skipEmptyLines: true,
//                 complete: (results) => {
//                     const data = results.data;
//                     const listOfOperations = [];
//                     const userPermissions = {};

//                     data.forEach((row) => {
//                         listOfOperations.push(row.operation);
//                         userRoles.forEach((role) => {
//                             if (!userPermissions[role]) {
//                                 userPermissions[role] = [];
//                             }
//                             userPermissions[role].push(row[role]?.toUpperCase() === 'TRUE');
//                         });
//                     });

//                     const finalPermissions = {};
//                     listOfOperations.forEach((operation, index) => {
//                         finalPermissions[operation] = userRoles.reduce((acc, role) => {
//                             return acc || userPermissions[role][index];
//                         }, false);
//                     });

//                     resolve(finalPermissions);
//                 },
//                 error: (err) => {
//                     reject(err);
//                 },
//             });
//         });
//     });
// });

Cypress.Commands.add('getUserRoles', (userRoles) => {
    const userRolesFile = 'user_roles.csv';

    // Check the environment and append '_demo' to the role names if in demo environment
    const environment = Cypress.env('environment') || 'prod';  // Default to 'prod' if no environment is specified
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

                    finalPermissions.any_permission = Object.values(finalPermissions).includes(true);

                    resolve(finalPermissions);
                },
                error: (err) => {
                    reject(err);
                },
            });
        });
    });
});
