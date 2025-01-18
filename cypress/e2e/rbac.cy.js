import { Common } from '../support/pages/common';

const rbac = new Common();
const userCredentials = Cypress.env('user');
const listOfRoles = Cypress.env('allowedRoleNames');
let permissions;

const urls = {
    insights : '/dashboardpage',
    dashboard : '/dashboard',
    timesheet: '/timesheet/empTimesheet',
    estimation: '/estimation',
    pricing : '/pricing',
    contract : '/client/contracts',
    milestone : 'client/contracts/milestone',
    purchaseOrder : '/client/contracts/purchase-order',
    allocation : '/client/allocations',
    invoice : '/client/invoices',
    resourceMetrics : '/resources',
};

listOfRoles.forEach((role) => {
    describe(`Role based access testing for ${role}`, () => {

        before(() => {
            cy.removeAllUserRoles(userCredentials.email);
            cy.waitForRoleUpdate('', true);
            const adjustedRole = Cypress.env('environment') === 'demo'? role + '_demo' : role;
            cy.assignUserRole(userCredentials.email, adjustedRole);
            cy.waitForRoleUpdate(adjustedRole, false);
            cy.window().then((window) => {
                const userData = JSON.parse(window.localStorage.getItem('userData'));
                const userRoles = userData.user_roles;
                cy.getUserPermissions(userRoles).then((userPermissions) => {
                    permissions = userPermissions;
                })
            })
        })

        it("Verifies Client Management access permissions", () => {
            if(permissions.client_view) {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.dashboard);
                if(permissions.client_admin) {
                    rbac.expectButtonVisible('Add Client');
                } else {
                    rbac.expectButtonToNotExist('Add Client');
                }
            } else if (permissions.default_user) {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies Estimation access permissions", () => {
            cy.log(permissions);
            if(permissions.client_management_module) {
                if(permissions.estimation_view) {
                    rbac.visitEstimation('');
                    rbac.expectUrlToContain(urls.estimation);
                    if(permissions.estimation_admin) {
                        rbac.expectButtonVisible('Add Estimation');
                    } else {
                        rbac.expectButtonToNotExist('Add Estimation');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!permissions.estimation_module){
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.dashboard);
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('Estimation');
                    } else {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.dashboard);
                        rbac.visitFirstEntryFromListing();
                        rbac.clickNavigationFor('Estimation');
                        rbac.expectNavigationDisabledFor('Effort Estimation');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies Pricing access permissions", () => {
            if(permissions.client_management_module) {
                if(permissions.pricing_view) {
                    rbac.visitPricing('');
                    rbac.expectUrlToContain(urls.pricing);
                    if (permissions.pricing_admin) {
                        rbac.expectButtonToExist('Add Pricing');
                    } else {
                        rbac.expectButtonToNotExist('Add Pricing');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!permissions.estimation_module) {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('Estimation');
                    } else {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.clickNavigationFor('Estimation');
                        rbac.expectNavigationDisabledFor('Pricing');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies SOW Contract access permissions", () => {
            if(permissions.client_management_module) {
                if(permissions.contract_view){
                    rbac.visitContracts('');
                    rbac.expectUrlToContain(urls.contract);
                    if (permissions.contract_admin) {
                        rbac.expectButtonToExist('Add Contract');
                    } else {
                        rbac.expectButtonToNotExist('Add Contract');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!permissions.contract_module) {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('SOWContract');
                    } else {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.clickNavigationFor('SOWContract');
                        rbac.expectNavigationDisabledFor('Contracts');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies Milestone access permissions", () => {
            if(permissions.client_management_module) {
                if(permissions.milestone_view) {
                    rbac.visitMilestone('');
                    rbac.expectUrlToContain(urls.milestone);
                    if (permissions.milestone_admin) {
                        rbac.expectButtonToExist('Add Milestone');
                    } else {
                        rbac.expectButtonToNotExist('Add Milestone');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!permissions.contract_module) {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('SOWContract');
                    } else {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.clickNavigationFor('SOWContract');
                        rbac.expectNavigationDisabledFor('Milestones');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies Purchase Order access permissions", () => {
            if(permissions.client_management_module) {
                if(permissions.purchase_order_view) {
                    rbac.visitPurchaseOrder('');
                    rbac.expectUrlToContain(urls.purchaseOrder);
                    if (permissions.purchase_order_admin) {
                        rbac.expectButtonToExist('Add Purchase Order');
                        rbac.expectButtonToExist('Assign Purchase Order');
                    } else {
                        rbac.expectButtonToNotExist('Add Purchase Order');
                        rbac.expectButtonToNotExist('Assign Purchase Order');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!permissions.contract_module) {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('SOWContract');
                    } else {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.clickNavigationFor('SOWContract');
                        rbac.expectNavigationDisabledFor('Purchase Orders');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies Allocations access permissions", () => {
            if(permissions.client_management_module) {
                if(permissions.allocation_view) {
                    rbac.visitAllocations('');
                    rbac.expectUrlToContain(urls.allocation);
                    if (permissions.allocation_admin) {
                        rbac.expectButtonToExist('Add Allocation');
                    } else {
                        rbac.expectButtonToNotExist('Add Allocation');
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                    } else {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('Allocations');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies Invoices access permissions", () => {
            if(permissions.client_management_module) {
                if(permissions.invoice_view) {
                    rbac.visitInvoices('');
                    rbac.expectUrlToContain(urls.invoice);
                    if (permissions.allocation_admin) {
                        rbac.expectInvoiceIconsEnabled();
                    } else {
                        rbac.expectInvoiceIconsDisabled();
                    }
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('Invoices');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(urls.timesheet);
            }
        })

        it("Verifies Timesheet access permissions", () => {
            if (permissions.timesheet_view) {
                rbac.visitTimesheets();
                rbac.expectUrlToContain(urls.timesheet);
                if(permissions.timesheet_manager) {
                    rbac.expectButtonVisible('Manager View');
                } else {
                    rbac.expectButtonToNotExist('Manager View');
                }
            } else {
                if (permissions.default_user) {
                    rbac.visitDashboard();
                    rbac.expectUrlToContain(urls.timesheet);
                    rbac.expectNavigationDisabledForDefaultUser();
                }
            }
        })

        it("Verifies Dashboard access permissions", () => {
            if (permissions.dashboard_view) {
                rbac.visitInsights();
                rbac.expectUrlToContain(urls.insights)
            } else {
                if (permissions.default_user) {
                    rbac.visitInsights();
                    rbac.expectUrlToContain(urls.timesheet);
                    rbac.expectNavigationDisabledForDefaultUser();
                } else {
                    rbac.visitTimesheets();
                    rbac.expectNavigationDisabledFor('Dashboard');
                }
            }
        })

        it("Verifies Resource Metrics access permissions", () => {
            if (permissions.resource_view) {
                rbac.visitTimesheets();
                rbac.clickNavigationFor('Resource Management');
                rbac.clickNavigationFor('Resource Metrics');
                rbac.expectUrlToContain(urls.resourceMetrics);
            } else {
                if (permissions.default_user) {
                    rbac.visitDashboard();
                    rbac.expectUrlToContain(urls.timesheet);
                } else {
                    rbac.visitTimesheets();
                    rbac.expectNavigationDisabledFor('Resource Management');
                }
            }
        })
    })
})
