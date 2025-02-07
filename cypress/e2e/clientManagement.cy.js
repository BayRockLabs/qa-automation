import { ClientManagement } from "../support/pages/client_management";
import { registerCommand } from "cypress-wait-for-stable-dom";

registerCommand();
let data;

before(() => {
  const client = new ClientManagement();
  client.action.login(Cypress.env("users")[0]);
  client.action.loadFixture("clientData.json").then((clientData) => {
    data = clientData;
  });
});

describe("Client Management - Create", () => {
  const testClient = new ClientManagement();

  it.only("Visits the client management page", () => {
    testClient.visit();
    testClient.action.url().should("contain", "/dashboard");
    testClient.expectClientManagementHeaderVisible();
    cy.pause();
  });

  it("Opens the add client popup", () => {
    testClient.openAddClientPopup();
    testClient.expectAddClientHeaderVisible();
  });

  it("Inputs client details", () => {
    testClient.fillClientName(data.client.name);
    testClient.fillClientAddress(data.client.address + " ");
    testClient.expectLeadingTrailingSpacesWarning();
    testClient.clearClientAddressField();
    testClient.fillClientAddress("qwerty");
    testClient.expectRandomCharactersInAddressFieldWarning();
    testClient.clearClientAddressField();
    testClient.fillClientAddress(data.client.address);
    testClient.selectClientCountry(data.client.country);
    testClient.selectClientState(data.client.state);
    testClient.selectClientCity(data.client.city);
    testClient.fillClientZipCode(data.client.zipCode + "1234567890");
    testClient.expectInvalidZipCodeWarning();
    testClient.clearZipCodeField();
    testClient.fillClientZipCode(data.client.zipCode);
    testClient.clickNextButton();
  });

  it("Inputs Organisation-level contract Details", () => {
    testClient.fillContractName(data.orgLevelContract.name);
    testClient.selectContractType(data.orgLevelContract.type);
    testClient.fillContractStartDate(data.orgLevelContract.startDate);
    testClient.fillContractEndDate(data.orgLevelContract.endDate);
    testClient.clickNextButton();
  });

  it("Creates new client", () => {
    testClient.clickCreateClientButton();
    testClient.expectClientAdded(data.client.name);
  });
});

describe("Client Management - Read", () => {
  const testClient = new ClientManagement();

  it("Visits the client management page", () => {
    testClient.visit(data.client.name);
    testClient.action.url().should("contain", "/dashboard");
    testClient.expectClientManagementHeaderVisible();
  });

  it("Opens the details for a client", () => {
    testClient.openClientDetails(data.client.name);
    testClient.expectOverviewHeaderVisible();
  });

  it("Reads client details", () => {
    testClient.expectClientNameToBe(data.client.name);
    testClient.expectClientAddressToBe(data.client.address);
    testClient.expectClientCityToBe(data.client.city);
    testClient.expectClientStateToBe(data.client.state);
    testClient.expectClientCountryToBe(data.client.countryShort);
    testClient.expectClientZipCodeToBe(data.client.zipCode);
  });

  it("Reads Organisation-level contract details", () => {
    testClient.expectContractNameToBe(data.orgLevelContract.name);
    testClient.expectContractTypeToBe(data.orgLevelContract.type);
    testClient.expectContractStartDateToBe(data.orgLevelContract.startDate);
    testClient.expectContractEndDateToBe(data.orgLevelContract.endDate);
  });
});

describe("Client Management - Update", () => {
  const testClient = new ClientManagement();

  it("Visits the client management page", () => {
    testClient.visit(data.client.name);
    testClient.action.url().should("contain", "/dashboard");
    testClient.expectClientManagementHeaderVisible();
  });

  it("Opens the details for a client", () => {
    testClient.openClientDetails(data.client.name);
    testClient.expectOverviewHeaderVisible();
  });

  it("Opens the edit client popup", () => {
    testClient.action.waitFor(4000);
    testClient.openEditClientPopup();
    testClient.expectEditClientHeaderVisible();
  });

  it("Updates client details", () => {
    testClient.clearClientAddressField();
    testClient.fillClientAddress("Updated Address");
    testClient.selectClientCountry("India");
    testClient.selectClientState("Maharashtra");
    testClient.selectClientCity("Mumbai");
    testClient.fillClientZipCode("12334");
    testClient.clickNextButton();
  });

  it("Updates organisation-level contract details", () => {
    testClient.clearContractNameField();
    testClient.fillContractName("Updated Contract Name");
    testClient.selectContractType("PSA");
    testClient.clearStartDateField();
    testClient.fillContractStartDate("2024-01-02");
    testClient.clickNextButton();
    testClient.updateClient();
  });

  it("Verifies new client details", () => {
    testClient.visit(data.client.name);
    testClient.openClientDetails(data.client.name);
    testClient.action.reload();
    testClient.expectClientNameToBe(data.client.name);
    testClient.expectClientAddressToBe("Updated Address");
    testClient.expectClientCityToBe("Mumbai");
    testClient.expectClientStateToBe("Maharashtra");
    testClient.expectClientCountryToBe("IN");
    testClient.expectClientZipCodeToBe("12334");
    testClient.expectContractNameToBe("Updated contract name");
    testClient.expectContractTypeToBe("PSA");
    testClient.expectContractStartDateToBe("2024-01-02");
  });
});

describe("Client Management - Delete", () => {
  const testClient = new ClientManagement();

  it("Visits the client management page", () => {
    testClient.visit();
    testClient.action.url().should("contain", "/dashboard");
    testClient.expectClientManagementHeaderVisible();
  });

  it("Deletes the test client", () => {
    testClient.deleteClient(data.client.name);
    testClient.expectClientDeleted(data.client.name);
  });
});
