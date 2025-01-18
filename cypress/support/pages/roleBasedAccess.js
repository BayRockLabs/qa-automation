/// <reference types="Cypress" />

class RoleBasedAccess {
    noAccessTooltipMessage = 'You don’t have access to this module';
    elements = {
        moduleNavigationFor : (moduleName) => cy.get('div').contains(moduleName),
        noAccessTooltip : () => cy.get('.MuiTooltip-tooltip'),
        buttonContaining : (buttonText) => cy.get('button').contains(buttonText),
        listingRecord: (labelName) => cy.get('span').contains(labelName),
        effortEstimationNavigation: () => cy.get('div').contains('Effort Estimation'),
        estimationNavigation: () => cy.get('div').contains('Estimation'),
        pricingNavigation: () => cy.get('div').contains('Pricing'),
        sowContractNavigation: () => cy.get('div').contains('SOWContract'),
        contractsNavigation: () => cy.get('div').contains('Contracts'),
        milestoneNavigation: () => cy.get('div').contains('Milestones'),
        purchaseOrderNavigation: () => cy.get('div').contains('Purchase Orders'),
        allocationNavigation: () => cy.get('div').contains('Allocations'),
        invoiceNavigation: () => cy.get('div').contains('Invoices'),
        editButton: () => cy.get('button').contains('Edit'),
        clientRecord: (clientName) => cy.get('span').contains(clientName),
        deleteButton: (recordLabel) => this
                                        .action
                                        .xpath(`//span[text()="${recordLabel}"]/ancestor::td/ancestor::tr//td//span//button`),
        invoiceIcons : {
            regenerate : () => cy.get('[data-testid="CachedOutlinedIcon"]'),
            email : () => cy.get('[data-testid="EmailOutlinedIcon"]'),
            markAsPaid : () => cy.get('[data-testid="CheckCircleOutlineOutlinedIcon"]'),
            download : () => cy.get('[data-testid="DownloadIcon"]')
        }
    };

    constructor() {
        this.urls = {};
        this.permissions = {};
    }
    
    loadUrls() {
        cy.fixture('urls.json').then((fixtureData) => {
            cy.wrap(fixtureData).should('exist');
            this.urls = fixtureData;
        })
    }

    visitInsights() {
        cy.visit(this.urls.insights);
    }

    visitDashboard() {
        cy.visit(this.urls.dashboard);
    }

    assignRoleToUser(email, roleName) {
        cy.assignUserRole(email, roleName);
    }

    removeAllUserRoles(email) {
        cy.removeAllUserRoles(email);
    }

    waitForRoleUpdate(roleName, expectEmptyRoles) {
        cy.waitForRoleUpdate(roleName, expectEmptyRoles);
    }

    getUserPermissionsFromRoles() {
        cy.window().then((window) => {
            const userData = JSON.parse(window.localStorage.getItem('userData'));
            const userRoles = userData.user_roles;
            cy.getUserPermissions(userRoles).then((userPermissions) => {
                this.permissions = userPermissions;
            })
        })
    }

    visitEstimation(clientName) {
        this.visitClientDetail(clientName);
        this.elements.estimationNavigation().click();
        this.elements.effortEstimationNavigation().click();
    }

    visitPricing(clientName) {
        this.visitClientDetail(clientName);
        this.elements.estimationNavigation().click();
        this.elements.pricingNavigation().click();
    }

    visitContracts(clientName) {
        this.visitClientDetail(clientName);
        this.elements.sowContractNavigation().click();
        this.elements.contractsNavigation().click();
    }

    visitMilestone(clientName) {
        this.visitClientDetail(clientName);       
        this.elements.sowContractNavigation().click();
        this.elements.milestoneNavigation().click();
    }

    visitPurchaseOrder(clientName) {
        this.visitClientDetail(clientName);     
        this.elements.sowContractNavigation().click();
        this.elements.purchaseOrderNavigation().click();
    }

    visitAllocations(clientName) {
        this.visitClientDetail(clientName);    
        this.elements.allocationNavigation().click();
    }

    visitInvoices(clientName) {
        this.visitClientDetail(clientName);
        this.elements.invoiceNavigation().click();
    }

    visitClientDetail(clientName) {
        if (clientName) {
            this.visitDashboard();
            this.get('span').contains(clientName).click();
        } else {
            cy.visit(this.urls.clientDetail);
        }
    }

    visitTimesheets() {
        cy.visit(this.urls.timesheet);
    }

    clickButtonContaining(buttonText) {
        this
            .elements
            .buttonContaining(buttonText)
            .click();
    }

    expectButtonVisible(buttonText) {
        this
            .elements
            .buttonContaining(buttonText)
            .should('exist')
            .and('be.visible');
    }

    expectButtonToExist(buttonText) {
        this
            .elements
            .buttonContaining(buttonText)
            .should('exist');
    }

    expectButtonToNotExist(buttonText) {
        this
            .elements
            .buttonContaining(buttonText)
            .should('not.exist');
    }

    clickNavigationFor(moduleName) {
        this
            .elements
            .moduleNavigationFor(moduleName)
            .click();
    }

    expectNavigationDisabledFor(moduleName){
        // this
        //     .elements
        //     .moduleNavigationFor(moduleName)
        //     .realHover();
        // this
        //     .elements
        //     .noAccessTooltip()
        //     .should('be.visible')
        //     .and('have.text', this.noAccessTooltipMessage);
        this
            .elements
            .moduleNavigationFor(moduleName)
            .should('have.css', 'pointer-events', 'none');
    }

    expectUrlToContain(url) {
        cy.url().should('contain', url);
    }

    expectNavigationDisabledForDefaultUser() {
        this.visitTimesheets();
        this.expectNavigationDisabledFor('Dashboard');
        this.expectNavigationDisabledFor('Client Management');
        this.expectNavigationDisabledFor('Resource Management');
    }

    expectInvoiceIconsEnabled() {
        // this.elements.invoiceIcons.regenerate().scrollIntoView().should('be.visible');
        // this.elements.invoiceIcons.email().scrollIntoView().should('be.visible');
        // this.elements.invoiceIcons.download().scrollIntoView().should('be.visible');
        // this.elements.invoiceIcons.markAsPaid().scrollIntoView().should('be.visible');
    }

    expectInvoiceIconsDisabled() {
        // this.elements.invoiceIcons.regenerate().should('not.exist');
        // this.elements.invoiceIcons.email().should('not.exist');
        // this.elements.invoiceIcons.download().should('not.exist');
        // this.elements.invoiceIcons.markAsPaid().should('not.exist');
    }
}

export { RoleBasedAccess };
