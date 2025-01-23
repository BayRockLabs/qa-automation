// Global configurations
import './commands'
import 'cypress-mochawesome-reporter/register';
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})