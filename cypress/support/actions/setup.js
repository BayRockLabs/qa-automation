class ProgrammaticTestSetup {
    constructor() {
        this.backendAPIBaseURL = "";
        this.apiEndpoints = {};
        this.uuid = {};
        this.requestPayloads = {};    
    }

    login(user) {
        cy.login(user);
        cy.reload();
    }


    loadAPIEndpoints() {
        this.backendAPIBaseURL = Cypress.env("BACKEND_API_BASE_URL");
        return cy.fixture("mock-api/endpoints.json").then((fixtureData) => {
            cy.wrap(fixtureData).should('exist');
            this.apiEndpoints = fixtureData;
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
        this.loadSetupData();
        return this.loadAPIEndpoints();
    }

    getAccessToken() {
        return cy.window().then((window) => {
            return (window.localStorage.getItem('microsoft_code'));
        });
    }

    createClient() {
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.clientManagement}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: this.requestPayloads["client-create"],
            }).then((response) => {
                console.log('Client create response body: ', response.body);
                cy.pause();
                expect(response.status).to.eq(200);
                expect(response.body.result.status).to.eq(200);
                expect(response.body).to.have.property("uuid");
                this.uuid.client = response.body.uuid;
            });
        })
    }

    createEstimation() {
        cy.wrap(this.uuid.client).should('exist');
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.estimation}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    ...this.requestPayloads["estimation-create"],
                    client: this.uuid.client,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.result.status).to.eq(200);
                expect(response.body.client).to.eq(this.uuid.client);
                this.uuid.estimation = response.body.uuid;
            });
        });
    }

    createPricing() {
        cy.wrap(this.uuid.client).should('exist');
        cy.wrap(this.uuid.estimation).should('exist');
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.pricing}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    ...this.requestPayloads["pricing-create"],
                    client: this.uuid.client,
                    estimation: this.uuid.estimation,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.result.status).to.eq(200);
                this.uuid.pricing = response.body.uuid;
            });
        })
    }

    createSOWContract() {
        // Make sure a client, estimation pricing exist before creating SOW Contract
        cy.wrap(this.uuid.client).should('exist');
        cy.wrap(this.uuid.estimation).should('exist');
        cy.wrap(this.uuid.pricing).should('exist');

        // API endpoint to create a SOW Contract
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.sowContract}`;

        // Get access token
        this.getAccessToken().then((accessToken) => {

            // Create a new form data payload
            const formData = new FormData();
            formData.append('contractsow_name', 'Cypress SOW Contract');
            formData.append('total_contract_amount', '339173.12');
            formData.append('start_date', '2025-01-01');
            formData.append('end_date', '2025-12-31');
            formData.append('payment_term_contract', 'Net 30');
            formData.append('contractsow_type', 'TIME AND MATERIAL');
            formData.append('client', this.uuid.client);
            formData.append('pricing', this.uuid.pricing);
            formData.append('estimation', this.uuid.estimation);
            formData.append('doc_contract_amount', '0');
            formData.append('doc_start_date', '');
            formData.append('doc_end_date', '');
            formData.append('extension_sow_contract', 'null');

            // Get SOW Contract fiel and encode it in binary and append to form data
            cy.fixture('test-documents/sow-contract-file.pdf', { encoding: 'binary' }).then((body) => {
                formData.append('file', new Blob([body], { type: 'application/pdf' }));

                // Finally, request to create SOW Contract API
                cy.request({
                    method: 'POST',
                    url: url,
                    body: formData,
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${accessToken}`
                    },
                  }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.result.status).to.eq(200);
                    this.uuid.sowContract = response.body.uuid;
                  });
            });
        });
    }

    createAllocation() {
        cy.wrap(this.uuid.client).should('exist');
        cy.wrap(this.uuid.estimation).should('exist');
        cy.wrap(this.uuid.pricing).should('exist');
        cy.wrap(this.uuid.sowContract).should('exist');
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.allocation}`;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    ...this.requestPayloads["allocation-create"],
                    client: this.uuid.client,
                    estimation: this.uuid.estimation,
                    contract_sow: this.uuid.sowContract,
                },
            }).then((response) => {     
                expect(response.status).to.eq(200);
                expect(response.body.result.status).to.eq(200);
                this.uuid.allocation = response.body.uuid;
            });
        });
    }
}

export { ProgrammaticTestSetup }