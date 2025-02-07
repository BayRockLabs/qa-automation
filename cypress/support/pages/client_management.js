import { Action } from "../actions/action";

class ClientManagement {
  elements = {
    clientManagementHeader: () =>
      this.action.get("p").contains("Client Management"),
    addClientHeader: () => this.action.get("span").contains("Add Client"),
    addClientPopupButton: () =>
      this.action.get("button").contains("Add Client"),
    clientNameInput: () => this.action.get("#outlined-adornment-clientname"),
    clientAddressInput: () =>
      this.action.get("#outlined-adornment-clientaddress"),
    addressLeadingTrailingSpacesWarning: () =>
      this.action
        .get("p")
        .contains(this.streetAddressLeadingTrailingSpacesWarning),
    randomCharactersInAddressFieldWarning: () =>
      this.action.get("p").contains(this.randomCharactersInAddressFieldWarning),
    countrySelect: () => this.action.get("#country-select"),
    stateSelect: () => this.action.get("#state-select"),
    citySelect: () => this.action.get("#city-select"),
    clientZipCodeInput: () => this.action.get("#outlined-adornment-zipcode"),
    invalidZipCodeWarning: () =>
      this.action.get("p").contains(this.invalidZipCodeWarning),
    nextButton: () => this.action.get("button").contains("Next"),
    contractNameInput: () =>
      this.action.get("#outlined-adornment-contractname"),
    contractTypeSelect: () => this.action.get("#demo-simple-select"),
    contractStartDateInput: () =>
      this.action.get('[placeholder="yyyy-mm-dd"]').eq(0),
    contractEndDateInput: () =>
      this.action.get('[placeholder="yyyy-mm-dd"]').eq(1),
    createClientButton: () =>
      this.action.get("button").contains("Create Client"),
    clientDeleteButton: (clientName) =>
      this.action.xpath(
        `//span[text()="${clientName}"]/ancestor::td/ancestor::tr//td//span//button`,
      ),
    deleteConfirmButton: () => this.action.get("button").contains("Delete"),
    clientRecord: (clientName) => this.action.get("span").contains(clientName),
    updateClientButton: () =>
      this.action.get("button").contains("Update Client"),
    clientDetails: {
      overviewHeader: () => this.action.get("p").contains("Overview"),
      clientName: () =>
        this.action.get("p").contains("Client Name").siblings().eq(0),
      clientAddress: () =>
        this.action.get("p").contains("Client Address").siblings().eq(0),
      clientCity: () => this.action.get("p").contains("City").siblings().eq(0),
      clientState: () =>
        this.action.get("p").contains("State").siblings().eq(0),
      clientCountry: () =>
        this.action.get("p").contains("Country").siblings().eq(0),
      clientZipCode: () =>
        this.action.get("p").contains("ZipCode").siblings().eq(0),
    },
    contractDetails: {
      contractName: () =>
        this.action.get("p").contains("Contract Name").siblings().eq(0),
      contractType: () =>
        this.action.get("p").contains("Contract Type").siblings().eq(0),
      startDate: () =>
        this.action.get("p").contains("Contract Start Date").siblings().eq(0),
      endDate: () =>
        this.action.get("p").contains("Contract End Date").siblings().eq(0),
    },
    globalPaymentDetails: {
      clientPaymentTerms: () =>
        this.action.get("p").contains("Client Payment Terms"),
    },
    editButton: () => this.action.get("button").contains("Edit"),
    editClientHeader: () => this.action.get("span").contains("Edit Client"),
  };

  constructor() {
    this.url = "/dashboard";
    this.action = new Action();
    this.streetAddressLeadingTrailingSpacesWarning =
      "Street address should not have leading or trailing spaces.";
    this.randomCharactersInAddressFieldWarning =
      "Address appears to contain random characters. Please enter a valid address.";
    this.invalidZipCodeWarning =
      "Zip code should be min 5 or max 8 digits (alphanumeric) long.";
  }

  visit() {
    this.action.visit(this.url);
  }

  openAddClientPopup() {
    this.elements.addClientPopupButton().click();
  }

  fillClientName(clientName) {
    this.elements.clientNameInput().type(clientName);
  }

  fillClientAddress(clientAddress) {
    this.elements.clientAddressInput().type(clientAddress);
  }

  clearClientAddressField() {
    this.elements.clientAddressInput().clear();
  }

  selectClientCountry(clientCountry) {
    this.elements.countrySelect().selectFromDropdown(clientCountry);
  }

  selectClientState(clientState) {
    this.elements.stateSelect().selectFromDropdown(clientState);
  }

  selectClientCity(clientCity) {
    this.elements.citySelect().selectFromDropdown(clientCity);
  }

  fillClientZipCode(clientZipCode) {
    this.elements.clientZipCodeInput().type(clientZipCode);
  }

  clearZipCodeField() {
    this.elements.clientZipCodeInput().clear();
  }

  clickNextButton() {
    this.elements.nextButton().click();
  }

  fillContractName(orgLevelContractName) {
    this.elements.contractNameInput().type(orgLevelContractName);
  }

  clearContractNameField() {
    this.elements.contractNameInput().clear();
  }

  selectContractType(contractType) {
    this.elements.contractTypeSelect().selectFromDropdown(contractType);
  }

  fillContractStartDate(date) {
    this.elements.contractStartDateInput().type(date);
  }

  clearStartDateField() {
    this.elements.contractStartDateInput().clear();
  }

  fillContractEndDate(date) {
    this.elements.contractEndDateInput().type(date);
  }

  clearEndDateField() {
    this.elements.contractEndDateInput().clear();
  }

  clickCreateClientButton() {
    this.elements.createClientButton().click();
  }

  updateClient() {
    this.elements.updateClientButton().click();
  }

  deleteClient(clientName) {
    this.action.waitFor(2000);
    this.elements.clientDeleteButton(clientName).click();
    this.elements.deleteConfirmButton().click();
  }

  openEditClientPopup(clientName) {
    this.elements.editButton().click();
  }

  expectEditClientHeaderVisible() {
    this.elements.editClientHeader().should("be.visible");
  }

  expectClientAdded(clientName) {
    this.elements.clientRecord(clientName).should("be.visible");
  }

  expectClientDeleted(clientName) {
    this.elements.clientRecord(clientName).should("not.exist");
  }

  expectClientManagementHeaderVisible() {
    this.elements.clientManagementHeader().should("be.visible");
  }

  expectAddClientHeaderVisible() {
    this.elements.addClientHeader().should("be.visible");
  }

  expectRandomCharactersInAddressFieldWarning() {
    this.elements.randomCharactersInAddressFieldWarning().should("be.visible");
  }

  expectLeadingTrailingSpacesWarning() {
    this.elements.addressLeadingTrailingSpacesWarning().should("be.visible");
  }

  expectInvalidZipCodeWarning() {
    this.action.waitFor(2000);
    this.elements.invalidZipCodeWarning().should("be.visible");
  }

  openClientDetails(clientName) {
    this.visit();
    this.elements.clientRecord(clientName).click();
  }

  expectClientNameToBe(clientName) {
    this.elements.clientDetails.clientName().should("contain", clientName);
  }

  expectClientAddressToBe(clientAddress) {
    this.elements.clientDetails
      .clientAddress()
      .should("contain", clientAddress);
  }

  expectClientCityToBe(clientCity) {
    this.elements.clientDetails.clientCity().should("contain", clientCity);
  }

  expectClientStateToBe(clientState) {
    this.elements.clientDetails.clientState().should("contain", clientState);
  }

  expectClientCountryToBe(clientCountry) {
    this.elements.clientDetails
      .clientCountry()
      .should("contain", clientCountry);
  }

  expectClientZipCodeToBe(clientZipCode) {
    this.elements.clientDetails
      .clientZipCode()
      .should("contain", clientZipCode);
  }

  expectContractNameToBe(orgLevelContractName) {
    this.elements.contractDetails
      .contractName()
      .should("contain", orgLevelContractName);
  }

  expectContractTypeToBe(contractType) {
    this.elements.contractDetails
      .contractType()
      .should("contain", contractType);
  }

  expectContractStartDateToBe(startDate) {
    this.elements.contractDetails.startDate().should("contain", startDate);
  }

  expectContractEndDateToBe(endDate) {
    this.elements.contractDetails.endDate().should("contain", endDate);
  }

  expectOverviewHeaderVisible() {
    this.elements.clientDetails.overviewHeader().should("be.visible");
  }
}

export { ClientManagement };
