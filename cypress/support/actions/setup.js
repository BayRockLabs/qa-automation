export default class ProgrammaticTestSetup {
    backendAPIBaseURL = Cypress.env("BACKEND_API_BASE_URL");
    apiEndpoints = {};
    uuid = {};
    requestPayloads = {};

    loadAPIEndpoints() {
        cy.fixture("mock-api/endpoints.json").then((apiEndpoints) => {
            this.apiEndpoints = apiEndpoints;
        })
    }

    loadSetupData() {
        return cy.task('readFilesInDirectory', 'cypress/fixtures/test-setup')
            .then((files) => {
                const fixturePromises = files.map(file => {
                    const fixtureName = file.replace('.json', '');
                    return cy.fixture(`test-setup/${file}`).then(fixtureData => {
                        this.requestPayloads[fixtureName] = fixtureData;
                    });
                });
                return Cypress.Promise.all(fixturePromises);
            });
    }

    initialiseTest() {
        this.loadAPIEndpoints();
        this.loadSetupData();
    }

    getAccessToken() {
        return cy.window().then((window) => {
            return window.localStorage.getItem('microsoft_code');
        });
    }

    createClient() {
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.clientManagement}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: this.requestPayloads["client-create"],
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("uuid");
                this.uuid.client = response.body.uuid;
            });
        })
    }

    createEstimation() {
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.estimation}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: this.requestPayloads["estimation-create"],
            }).then((response) => {
                expect(response.status).to.eq(200);
                this.uuid.estimation = response.body.uuid;
            });
        });
    }

    createPricing() {
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.pricing}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: this.requestPayloads["pricing-create"],
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        })
    }

    createSOWContract() {
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.pricing}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: this.requestPayloads["sow-contract-create"],
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    }

    createAllocation() {
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.allocation}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: this.requestPayloads["allocation-create"],
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    }
}