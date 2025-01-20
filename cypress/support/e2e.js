// Global configurations
import './commands'
import 'cypress-real-events'

Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})