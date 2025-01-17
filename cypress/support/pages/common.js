/// <reference types="Cypress" />

import action from '../actions/action';

class Common {
    noAccessTooltipMessage = 'You don’t have access to this module';
    elements = {
        moduleNavigationFor : (moduleName) => action.get('div').contains(moduleName),
        noAccessTooltip : (moduleName) => action.get('.MuiTooltip-tooltip'),
        buttonContaining : (buttonText) => action.get('button').contains(buttonText),
        listingRecord: (labelName) => action.get('span').contains(labelName),
        effortEstimationNavigation: () => action.get('div').contains('Effort Estimation'),
        estimationNavigation: () => action.get('div').contains('Estimation'),
        pricingNavigation: () => action.get('div').contains('Pricing'),
        sowContractNavigation: () => action.get('div').contains('SOWContract'),
        contractsNavigation: () => action.get('div').contains('Contracts'),
        milestoneNavigation: () => action.get('div').contains('Milestones'),
        purchaseOrderNavigation: () => action.get('div').contains('Purchase Orders'),
        allocationNavigation: () => action.get('div').contains('Allocations'),
        invoiceNavigation: () => action.get('div').contains('Invoices'),
        editButton: () => action.get('button').contains('Edit'),
        clientRecord: (clientName) => action.get('span').contains(clientName),
        deleteButton: (recordLabel) => this
                                        .action
                                        .xpath(`//span[text()="${recordLabel}"]/ancestor::td/ancestor::tr//td//span//button`),
        invoiceIcons : {
            regenerate : () => action.get('[data-testid="CachedOutlinedIcon"]'),
            email : () => action.get('[data-testid="EmailOutlinedIcon"]'),
            markAsPaid : () => action.get('[data-testid="CheckCircleOutlineOutlinedIcon"]'),
            download : () => action.get('[data-testid="DownloadIcon"]')
        }
    };
    
    visitDashboard() {
        action.visit('/dashboard');
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

    visitFirstEntryFromListing() {
        action.visit('/client/detail');
        // action.get('tr').eq(1).click();
    }

    clickNavigationFor(moduleName) {
        this
            .elements
            .moduleNavigationFor(moduleName)
            .click();
    }

    expectNavigationDisabledFor(moduleName){
        this
            .elements
            .moduleNavigationFor(moduleName)
            .realHover();
        this
            .elements
            .noAccessTooltip()
            .should('be.visible')
            .and('have.text', this.noAccessTooltipMessage);
    }

    visitInsights() {
        action.visit('/dashboardpage');
    }

    visitEstimation(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            action.visit('/client/detail')
            // action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.estimationNavigation().click();
        this.elements.effortEstimationNavigation().click();
    }

    visitPricing(clientName) {
        this.visitDashboard();
        if(clientName === ''){
            action.visit('/client/detail')
            // action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.estimationNavigation().click();
        this.elements.pricingNavigation().click();
    }

    visitContracts(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            action.visit('/client/detail')
            // action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.sowContractNavigation().click();
        this.elements.contractsNavigation().click();
    }

    visitMilestone(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            action.visit('/client/detail')
            // action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.sowContractNavigation().click();
        this.elements.milestoneNavigation().click();
    }

    visitPurchaseOrder(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            action.visit('/client/detail')
            // action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.sowContractNavigation().click();
        this.elements.purchaseOrderNavigation().click();
    }

    visitAllocations(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            action.visit('/client/detail')
            // action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.allocationNavigation().click();
    }

    visitInvoices(clientName) {
        this.visitDashboard();
        if (clientName === '') {
            action.visit('/client/detail')
            // action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.invoiceNavigation().click();
    }

    visitTimesheets() {
        this.visitDashboard();
        this
            .elements
            .moduleNavigationFor('Timesheets')
            .click();
    }

    expectUrlToContain(url) {
        action.url().should('contain', url);
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

export { Common };
