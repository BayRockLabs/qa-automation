/// <reference types="Cypress" />

import { Action } from '../actions/action';

class Common {
    noAccessTooltipMessage = 'You don’t have access to this module';
    elements = {
        moduleNavigationFor : (moduleName) => this.action.get('div').contains(moduleName),
        noAccessTooltip : (moduleName) => this.action.get('div').contains(moduleName).parent(),
        buttonContaining : (buttonText) => this.action.get('button').contains(buttonText),
        listingRecord: (labelName) => this.action.get('span').contains(labelName),
        effortEstimationNavigation: () => this.action.get('div').contains('Effort Estimation'),
        estimationNavigation: () => this.action.get('div').contains('Estimation'),
        pricingNavigation: () => this.action.get('div').contains('Pricing'),
        sowContractNavigation: () => this.action.get('div').contains('SOWContract'),
        contractsNavigation: () => this.action.get('div').contains('Contracts'),
        milestoneNavigation: () => this.action.get('div').contains('Milestones'),
        purchaseOrderNavigation: () => this.action.get('div').contains('Purchase Orders'),
        allocationNavigation: () => this.action.get('div').contains('Allocations'),
        invoiceNavigation: () => this.action.get('div').contains('Invoices'),
        editButton: () => this.action.get('button').contains('Edit'),
        clientRecord: (clientName) => this.action.get('span').contains(clientName),
        deleteButton: (recordLabel) => this
                                        .action
                                        .xpath(`//span[text()="${recordLabel}"]/ancestor::td/ancestor::tr//td//span//button`),
        invoiceIcons : {
            regenerate : () => this.action.get('[data-testid="CachedOutlinedIcon"]'),
            email : () => this.action.get('[data-testid="EmailOutlinedIcon"]'),
            markAsPaid : () => this.action.get('[data-testid="CheckCircleOutlineOutlinedIcon"]'),
            download : () => this.action.get('[data-testid="DownloadIcon"]')
        }
    };
    constructor() {
        this.action = new Action();
    }

    visitDashboard() {
        this.action.visit('/dashboard');
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
        this.action.get('tr').eq(1).click();
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
            .click({force: true});
        this.expectUrlToContain('/client/detail');
    }

    visitInsights() {
        this.action.visit('/dashboardpage');
    }

    visitEstimation(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            this.action.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.estimationNavigation().click();
        this.elements.effortEstimationNavigation().click();
    }

    visitPricing(clientName) {
        this.visitDashboard();
        if(clientName === ''){
            this.visitFirstEntryFromListing();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.estimationNavigation().click();
        this.elements.pricingNavigation().click();
    }

    visitContracts(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            this.visitFirstEntryFromListing();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.sowContractNavigation().click();
        this.elements.contractsNavigation().click();
    }

    visitMilestone(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            this.visitFirstEntryFromListing();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.sowContractNavigation().click();
        this.elements.milestoneNavigation().click();
    }

    visitPurchaseOrder(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            this.visitFirstEntryFromListing();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.sowContractNavigation().click();
        this.elements.purchaseOrderNavigation().click();
    }

    visitAllocations(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            this.visitFirstEntryFromListing();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.allocationNavigation().click();
    }

    visitInvoices(clientName) {
        this.visitDashboard();
        if (clientName === '') {
            this.visitFirstEntryFromListing();
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
        this.action.url().should('contain', url);
    }

    expectInvoiceIconsEnabled() {
        this.elements.invoiceIcons.regenerate().scrollIntoView().should('be.visible');
        this.elements.invoiceIcons.email().scrollIntoView().should('be.visible');
        this.elements.invoiceIcons.download().scrollIntoView().should('be.visible');
        this.elements.invoiceIcons.markAsPaid().scrollIntoView().should('be.visible');
    }

    expectInvoiceIconsDisabled() {
        this.elements.invoiceIcons.regenerate().should('not.exist');
        this.elements.invoiceIcons.email().should('not.exist');
        this.elements.invoiceIcons.download().should('not.exist');
        this.elements.invoiceIcons.markAsPaid().should('not.exist');
    }
}

export { Common };
