import { Action } from '../support/actions/action';
import { ClientManagement } from '../support/pages/client_management';
import { Common } from '../support/pages/common';

const rbac = new Common();
const users = Cypress.env('users');
const url = {
    dashboard: '/dashboard',
    timesheet: '/timesheet/empTimesheet',
    estimation: '/estimation',
    pricing : '/pricing',

}

users.forEach(user => {
    describe(`Role based access testing for ${user.email}`, () => {
        beforeEach(() => {
            rbac.action.clearSessionData();
            rbac.action.login(user);
            rbac.action.window().then((window) => {
                const userData = JSON.parse(window.localStorage.getItem('userData'));
                const userRoles = userData.user_roles;
                rbac.action.getUserRoles(userRoles);
            })
            rbac.action.get('@userPermissions').should('exist');
        })

        it("Verifies client management access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
                if(permissions.client_view) {
                    rbac.visitDashboard();
                    rbac.expectUrlToContain(url.dashboard);
                    if(permissions.client_admin) {
                        rbac.expectButtonVisible('Add Client');
                    } else {
                        rbac.expectButtonToNotExist('Add Client');
                    }
                } else if (permissions.default_user) {
                    rbac.expectUrlToContain(url.timesheet);
                }
            })
        });

        it("Verifies estimation access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
                if(permissions.estimation_view) {
                    rbac.visitEstimation();
                    rbac.expectUrlToContain(url.estimation);
                    if(permissions.estimation_admin) {
                        rbac.expectButtonVisible('Add Estimation');
                    } else {
                        rbac.expectButtonToNotExist('Add Estimation');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(url.timesheet);
                    } else if (!permissions.estimation_module){
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(url.dashboard);
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('Estimation');
                    } else {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(url.dashboard);
                        rbac.visitFirstEntryFromListing();
                        rbac.clickNavigationFor('Estimation');
                        rbac.expectNavigationDisabledFor('Effort Estimation');
                    }
                }
            })
        })

        it("Verifies pricing access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
                if(permissions.pricing_view) {
                    rbac.visitPricing();
                    rbac.expectUrlToContain(url.pricing);
                    if (permissions.pricing_admin) {
                        rbac.expectButtonToExist('Add Pricing');
                    } else {
                        rbac.expectButtonToNotExist('Add Pricing');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(url.timesheet);
                    } else if (!permissions.estimation_module) {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('Estimation');
                    } else {
                        rbac.visitDashboard();
                        rbav.visitFirstEntryFromListing();
                        rbac.clickNavigationFor('Estimation');
                        rbac.expectNavigationDisabledFor('Pricing');
                    }
                }
            })
        })

        it("Verifies SOW Contract access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
                rbac.visitContracts();
                rbac.expectUrlToContain(url.contract);
            })
        })
    })
})