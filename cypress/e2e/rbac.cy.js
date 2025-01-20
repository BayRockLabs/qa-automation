import { RoleBasedAccess } from '../support/pages/roleBasedAccess';
import { adjustUserRolesAccordingToEnvironment } from '../support/utils/common';

const rbac = new RoleBasedAccess();
const userCredentials = Cypress.env('USER');
const listOfRoles = Cypress.env('ALLOWED_ROLE_NAMES');

listOfRoles.forEach((role) => {
    describe(`Role based access testing for ${role}`, () => {

        before(() => {
            rbac.loadUrls();
            rbac.removeAllUserRoles(userCredentials.email);
            rbac.waitForRoleUpdate('', true);
            const adjustedRole = adjustUserRolesAccordingToEnvironment(role);
            rbac.assignRoleToUser(userCredentials.email, adjustedRole);
            rbac.waitForRoleUpdate(adjustedRole, false);
            rbac.getUserPermissionsFromRoles();
        })

        it("Verifies Client Management access permissions", () => {
            if (rbac.permissions.client_view) {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.dashboard);
                if (rbac.permissions.client_admin) {
                    rbac.expectButtonVisible('Add Client');
                } else {
                    rbac.expectButtonToNotExist('Add Client');
                }
            } else if (rbac.permissions.default_user) {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies Estimation access permissions", () => {
            if (rbac.permissions.client_management_module) {
                if (rbac.permissions.estimation_view) {
                    rbac.visitEstimation();
                    rbac.expectUrlToContain(rbac.urls.estimation);
                    if (rbac.permissions.estimation_admin) {
                        rbac.expectButtonVisible('Add Estimation');
                    } else {
                        rbac.expectButtonToNotExist('Add Estimation');
                    }
                } else {
                    if (rbac.permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(rbac.urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!rbac.permissions.estimation_module) {
                        rbac.visitClientDetail();
                        rbac.expectNavigationDisabledFor('Estimation');
                    } else {
                        rbac.visitClientDetail();
                        rbac.clickNavigationFor('Estimation');
                        rbac.expectNavigationDisabledFor('Effort Estimation');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies Pricing access permissions", () => {
            if (rbac.permissions.client_management_module) {
                if (rbac.permissions.pricing_view) {
                    rbac.visitPricing();
                    rbac.expectUrlToContain(rbac.urls.pricing);
                    if (rbac.permissions.pricing_admin) {
                        rbac.expectButtonToExist('Add Pricing');
                    } else {
                        rbac.expectButtonToNotExist('Add Pricing');
                    }
                } else {
                    if (rbac.permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(rbac.urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!rbac.permissions.estimation_module) {
                        rbac.visitClientDetail();
                        rbac.expectNavigationDisabledFor('Estimation');
                    } else {
                        rbac.visitClientDetail();
                        rbac.clickNavigationFor('Estimation');
                        rbac.expectNavigationDisabledFor('Pricing');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies SOW Contract access permissions", () => {
            if (rbac.permissions.client_management_module) {
                if (rbac.permissions.contract_view) {
                    rbac.visitContracts();
                    rbac.expectUrlToContain(rbac.urls.contract);
                    if (rbac.permissions.contract_admin) {
                        rbac.expectButtonToExist('Add Contract');
                    } else {
                        rbac.expectButtonToNotExist('Add Contract');
                    }
                } else {
                    if (rbac.permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(rbac.urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!rbac.permissions.contract_module) {
                        rbac.visitClientDetail();
                        rbac.expectNavigationDisabledFor('SOWContract');
                    } else {
                        rbac.visitClientDetail();
                        rbac.clickNavigationFor('SOWContract');
                        rbac.expectNavigationDisabledFor('Contracts');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies Milestone access permissions", () => {
            if (rbac.permissions.client_management_module) {
                if (rbac.permissions.milestone_view) {
                    rbac.visitMilestone();
                    rbac.expectUrlToContain(rbac.urls.milestone);
                    if (rbac.permissions.milestone_admin) {
                        rbac.expectButtonToExist('Add Milestone');
                    } else {
                        rbac.expectButtonToNotExist('Add Milestone');
                    }
                } else {
                    if (rbac.permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(rbac.urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!rbac.permissions.contract_module) {
                        rbac.visitClientDetail();
                        rbac.expectNavigationDisabledFor('SOWContract');
                    } else {
                        rbac.visitClientDetail();
                        rbac.clickNavigationFor('SOWContract');
                        rbac.expectNavigationDisabledFor('Milestones');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies Purchase Order access permissions", () => {
            if (rbac.permissions.client_management_module) {
                if (rbac.permissions.purchase_order_view) {
                    rbac.visitPurchaseOrder();
                    rbac.expectUrlToContain(rbac.urls.purchaseOrder);
                    if (rbac.permissions.purchase_order_admin) {
                        rbac.expectButtonToExist('Add Purchase Order');
                        rbac.expectButtonToExist('Assign Purchase Order');
                    } else {
                        rbac.expectButtonToNotExist('Add Purchase Order');
                        rbac.expectButtonToNotExist('Assign Purchase Order');
                    }
                } else {
                    if (rbac.permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(rbac.urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else if (!rbac.permissions.contract_module) {
                        rbac.visitClientDetail();
                        rbac.expectNavigationDisabledFor('SOWContract');
                    } else {
                        rbac.visitClientDetail();
                        rbac.clickNavigationFor('SOWContract');
                        rbac.expectNavigationDisabledFor('Purchase Orders');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies Allocations access permissions", () => {
            if (rbac.permissions.client_management_module) {
                if (rbac.permissions.allocation_view) {
                    rbac.visitAllocations();
                    rbac.expectUrlToContain(rbac.urls.allocation);
                    if (rbac.permissions.allocation_admin) {
                        rbac.expectButtonToExist('Add Allocation');
                    } else {
                        rbac.expectButtonToNotExist('Add Allocation');
                    }
                } else {
                    if (rbac.permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(rbac.urls.timesheet);
                    } else {
                        rbac.visitClientDetail();
                        rbac.expectNavigationDisabledFor('Allocations');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies Invoices access permissions", () => {
            if (rbac.permissions.client_management_module) {
                if (rbac.permissions.invoice_view) {
                    rbac.visitInvoices();
                    rbac.expectUrlToContain(rbac.urls.invoice);
                    if (rbac.permissions.allocation_admin) {
                        // rbac.expectInvoiceIconsEnabled();
                    } else {
                        // rbac.expectInvoiceIconsDisabled();
                    }
                } else {
                    if (rbac.permissions.default_user) {
                        rbac.visitDashboard();
                        rbac.expectUrlToContain(rbac.urls.timesheet);
                        rbac.expectNavigationDisabledForDefaultUser();
                    } else {
                        rbac.visitClientDetail();
                        rbac.expectNavigationDisabledFor('Invoices');
                    }
                }
            } else {
                rbac.visitDashboard();
                rbac.expectUrlToContain(rbac.urls.timesheet);
            }
        })

        it("Verifies Timesheet access permissions", () => {
            if (rbac.permissions.timesheet_view) {
                rbac.visitTimesheets();
                rbac.expectUrlToContain(rbac.urls.timesheet);
                if (rbac.permissions.timesheet_manager_view) {
                    rbac.expectButtonVisible('Manager View');
                } else {
                    rbac.expectButtonToNotExist('Manager View');
                }
            } else {
                if (rbac.permissions.default_user) {
                    rbac.visitDashboard();
                    rbac.expectUrlToContain(rbac.urls.timesheet);
                    rbac.expectNavigationDisabledForDefaultUser();
                }
            }
        })

        it.only("Verifies Timesheet Export access permissions", () => {
            if (rbac.permissions.timesheet_export) {
                rbac.visitTimesheets();
                rbac.expectUrlToContain(rbac.urls.timesheet);
                if (rbac.permissions.timesheet_export) {
                    rbac.clickNavigationFor('Export Timesheet');
                    rbac.expectUrlToContain(rbac.urls.exportTimesheet);
                    rbac.expectButtonVisible('Export to JSON');
                    rbac.expectButtonVisible('Export to Excel');
                } else {
                    rbac.expectNavigationToNotExistFor('Export Timesheet');
                }
            }
        })

        it.only("Verifies Timesheet Approve  access permissions", () => {
            if (rbac.permissions.timesheet_approve) {
                rbac.visitTimesheets();
                rbac.expectUrlToContain(rbac.urls.timesheet);
                rbac.expectButtonVisible('Manager View');
                rbac.clickButtonContaining('Manager View');
                rbac.expectButtonVisible('Approve Timesheets');
            }
        })

        it("Verifies Dashboard access permissions", () => {
            if (rbac.permissions.dashboard_view) {
                rbac.visitInsights();
                rbac.expectUrlToContain(rbac.urls.insights)
            } else {
                if (rbac.permissions.default_user) {
                    rbac.visitInsights();
                    rbac.expectUrlToContain(rbac.urls.timesheet);
                    rbac.expectNavigationDisabledForDefaultUser();
                } else {
                    rbac.visitTimesheets();
                    rbac.expectNavigationDisabledFor('Dashboard');
                }
            }
        })

        it("Verifies Resource Metrics access permissions", () => {
            if (rbac.permissions.resource_view) {
                rbac.visitTimesheets();
                rbac.clickNavigationFor('Resource Management');
                rbac.clickNavigationFor('Resource Metrics');
                rbac.expectUrlToContain(rbac.urls.resourceMetrics);
            } else {
                if (rbac.permissions.default_user) {
                    rbac.visitDashboard();
                    rbac.expectUrlToContain(rbac.urls.timesheet);
                } else {
                    rbac.visitTimesheets();
                    rbac.expectNavigationDisabledFor('Resource Management');
                }
            }
        })
    })
})
