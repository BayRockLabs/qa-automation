import { ProgrammaticTestSetup } from '../support/actions/setup';

const setup = new ProgrammaticTestSetup();
const user = Cypress.env('USER');

describe('Programmatic Test Setup', () => {
    before(() => {
        setup.login(user);
        setup.initialiseTest().then(() => {
            setup.createClient();
        })
        console.log(`------------- Client created --------------------\n uuid: ${setup.uuid.client}`);
    })

    it("Checks if the setup is done", () => {

    })
})