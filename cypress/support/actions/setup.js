import { access } from "fs";

class ProgrammaticTestSetup {
    constructor() {
        this.backendAPIBaseURL = Cypress.env("BACKEND_API_BASE_URL");
        this.apiEndpoints = {
            clientManagement: "/c2c_service/client",
            estimation: "/c2c_service/estimation",
            pricing: "/c2c_service/pricing",
            sowContract: "/c2c_service/contractsow",
            milestone: "/c2c_service/milestones",
            purchaseOrder: "/c2c_service/purchase_orders_client_all",
            allocation: "/c2c_service/allocation",
            invoice: "/c2c_service/invoices/client",
            timesheet: "/c2c_service/employee-timesheets",
            timesheetManagerNotificationCount: "/c2c_service/ts-manager-notification-count",
            managerView: "/c2c_service/resource/timesheet",
            autoSearch: "/c2c_service/auto-search"
        };
        this.uuid = {};
        this.requestPayloads = {};
        this.errorMessages = {
            clientAlreadyExists: "Client with this name already exists.",
        }
    }

    login(user) {
        cy.login(user);
        cy.reload();
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

    getAccessToken() {
        return cy.window().then((window) => {
            return (window.localStorage.getItem('microsoft_code'));
        });
    }

    deleteClient(clientNameSearch) {
        console.log(this.apiEndpoints);
        console.log(this.backendAPIBaseURL);
        const autoSearchURL = `${this.backendAPIBaseURL}${this.apiEndpoints.autoSearch}`;
        let clientUUID;
        this.getAccessToken().then((accessToken) => {
            cy.request({
                method: "GET",
                url: autoSearchURL,
                qs: {
                    search_query: clientNameSearch,
                    search_type: "client"
                }
            }).then((response) => {
                console.log(response);
                expect(response.status).to.eq(200);
                console.log(response);
                if (response.body.results[0]) {
                    clientUUID = response.body.results[0].uuid;
                    const deleteURL = `${this.backendAPIBaseURL}${this.apiEndpoints.clientManagement}/${clientUUID}`;
                    cy.request({
                        method: "DELETE",
                        url: deleteURL,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                    })
                }
            })
        })
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
                expect(response.status).to.eq(201);
                expect(response.body.result.status).to.eq(200);
                expect(response.body).to.have.property("uuid");
                this.uuid.client = response.body.uuid;
            });
        })
    }

    createEstimation() {
        console.log('------- client uuid', this.uuid.client)
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
                expect(response.status).to.eq(201);
                expect(response.body.result.status).to.eq(200);
                expect(response.body.client).to.eq(this.uuid.client);
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
                body: {
                    ...this.requestPayloads["pricing-create"],
                    client: this.uuid.client,
                    estimation: this.uuid.estimation,
                },
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.result.status).to.eq(200);
                this.uuid.pricing = response.body.uuid;
            });
        })
    }

    createSOWContract() {
        // API endpoint to create a SOW Contract
        const url = `${this.backendAPIBaseURL}${this.apiEndpoints.sowContract}`;

        // Get access token
        this.getAccessToken().then((accessToken) => {
            // Get SOW Contract fiel and encode it in binary and append to form data
            cy.fixture('test-documents/sow-contract-file.pdf', 'binary')
                .then((file) => {

                    // Construct formData to send as payload
                    const formData = new FormData();
                    const payload = this.requestPayloads["sow-contract-create"];
                    Object.entries(payload).forEach(([key, value]) => {
                        formData.append(key, value);
                    })
                    formData.append('client', this.uuid.client);
                    formData.append('estimation', this.uuid.estimation);
                    formData.append('pricing', this.uuid.pricing);

                    // Finally, request to create SOW Contract API
                    cy.request({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: FormData,
                        form: true,
                    }).then((response) => {
                        console.log('--------SOW Contract response----------\n', response);
                        expect(response.status).to.eq(200);
                        this.uuid.sowContract = response.body.uuid;
                    });
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