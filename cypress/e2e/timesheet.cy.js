import { ProgrammaticTestSetup } from '../support/actions/setup';

const setup = new ProgrammaticTestSetup();
const user = Cypress.env('USER');

describe('Programmatic Test Setup', () => {
    before(() => {
        setup.login(user);
        setup.loadSetupData();
        setup.deleteClient('cypress client');
        setup.createClient();
        setup.createEstimation();
        setup.createPricing();
        setup.createSOWContract();
    })

    it("Checks if the setup is done", () => {

    })
})