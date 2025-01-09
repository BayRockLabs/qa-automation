import { Common } from '../support/pages/common';
import { assignRole, removeRole } from '../support/utils/roleManagement';

const rbac = new Common();
const users = Cypress.env('users');

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
};

users.forEach(user => {
    describe(`Role based access testing for ${user.email}`, () => {

        before(() => {
            rbac.action.clearSessionData();
            
            rbac.action.login(user);
        })
            
        beforeEach(() => {
            rbac.action.window().then((window) => {
                const userData = JSON.parse(window.localStorage.getItem('userData'));
                const userRoles = userData.user_roles;
                rbac.action.getUserRoles(userRoles);
            })
            rbac.action.get('@userPermissions').should('exist');
        })

        it.only("Assigns super_admin to me", () => {
            assignRole('jasjaap.s@bayrocklabs.com', 'c2c_super_admin_demo');
        })

        it("Verifies Client Management access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
                if(permissions.client_view) {
                    rbac.visitDashboard();
                    rbac.expectUrlToContain(urls.dashboard);
                    if(permissions.client_admin) {
                        rbac.expectButtonVisible('Add Client');
                    } else {
                        rbac.expectButtonToNotExist('Add Client');
                    }
                } else if (permissions.default_user) {
                    rbac.expectUrlToContain(urls.timesheet);
                }
            })
        });

        it("Verifies Estimation access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
            })
        })

        it("Verifies Pricing access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
            })
        })

        it("Verifies SOW Contract access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
            })
        })

        it("Verifies Milestone access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
            })
        })

        it("Verifies Purchase Order access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
            })
        })

        it("Verifies Allocations access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
            })
        })

        it("Verifies Invoices access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
                    } else {
                        rbac.visitDashboard();
                        rbac.visitFirstEntryFromListing();
                        rbac.expectNavigationDisabledFor('Invoices');
                    }
                }
            })
        })

        it("Verifies Timesheet access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
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
                    } else {
                        rbac.visitDashboard();
                        rbac.expectNavigationDisabledFor('Timesheets');
                    }
                }
            })
        })

        it("Verifies Dashboard access permissions", () => {
            rbac.action.get('@userPermissions').then((permissions) => {
                if (permissions.dashboard_view) {
                    rbac.visitInsights();
                    rbac.expectUrlToContain(urls.insights)
                } else {
                    if (permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(urls.timesheet);
                    } else {
                        rbac.visitDashboard();
                        rbac.expectNavigationDisabledFor('Dashboard');
                    }
                }
            })
        })

        it("Verifies Resource Metrics access permissions", () => {
            
        })
    })
})