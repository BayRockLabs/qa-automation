// Global configurations
import './commands'
import 'cypress-real-events'
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})