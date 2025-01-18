/// <reference types="Cypress" />

class Common {
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
    
    visitDashboard() {
        cy.visit('/dashboard');
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
        cy.visit('/client/detail');
        // cy.get('tr').eq(1).click();
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
            .invoke('show')
            .realHover();
            // .realHover();
        this
            .elements
            .noAccessTooltip()
            .should('be.visible')
            .and('have.text', this.noAccessTooltipMessage);
    }

    visitInsights() {
        cy.visit('/dashboardpage');
    }

    visitEstimation(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            cy.visit('/client/detail')
            // cy.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.estimationNavigation().click();
        this.elements.effortEstimationNavigation().click();
    }

    visitPricing(clientName) {
        this.visitDashboard();
        if(clientName === ''){
            cy.visit('/client/detail')
            // cy.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.estimationNavigation().click();
        this.elements.pricingNavigation().click();
    }

    visitContracts(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            cy.visit('/client/detail')
            // cy.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.sowContractNavigation().click();
        this.elements.contractsNavigation().click();
    }

    visitMilestone(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            cy.visit('/client/detail')
            // cy.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.sowContractNavigation().click();
        this.elements.milestoneNavigation().click();
    }

    visitPurchaseOrder(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            cy.visit('/client/detail')
            // cy.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.sowContractNavigation().click();
        this.elements.purchaseOrderNavigation().click();
    }

    visitAllocations(clientName) {
        this.visitDashboard();
        if (clientName === ''){
            cy.visit('/client/detail')
            // cy.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }        
        this.elements.allocationNavigation().click();
    }

    visitInvoices(clientName) {
        this.visitDashboard();
        if (clientName === '') {
            cy.visit('/client/detail')
            // cy.get('tr').eq(1).click();
        } else {
            this.elements.clientRecord(clientName).click();
        }
        this.elements.invoiceNavigation().click();
    }

    visitTimesheets() {
        cy.visit(this.urls.timesheet);
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

export { Common };
