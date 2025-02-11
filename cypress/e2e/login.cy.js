const user = Cypress.env("USER");

describe("Client Management - Create", () => {
    it("logs me into the c2c application", () => {
        cy.sessionLogin(user);
    })
})