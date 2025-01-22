// Global configurations
import './commands'
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})