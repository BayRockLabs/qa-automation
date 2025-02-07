import { Action } from "../actions/action";

class Contract {
  elements = {
    clientRecord: (clientName) => this.action.get("span").contains(clientName),
    sowContractNavigation: () => this.action.get("div").contains("SOWContract"),
    contractsNavigation: () => this.action.get("div").contains("Contracts"),
    contractsHeader: () => this.action.get("p").contains("Contracts"),
    addContractButton: () => this.action.get("button").contains("Add Contract"),
    addContractHeader: () => this.action.get("h4").contains("Add Contract"),
    estimationNameSelect: () => this.action.get('[role="combobox"]').eq(0),
    pricingNameSelect: () => this.action.get('[role="combobox"]').eq(1),
    contractTypeSelect: () => this.action.get('[role="combobox"]').eq(2),
    paymentTermsSelect: () => this.action.get('[role="combobox"]').eq(3),
    contractNameInput: () =>
      this.action.xpath(
        '//label[.//div[contains(text(), "Contract Name")]]/following-sibling::div//input',
      ),
    contractRecord: (contractName) =>
      this.action.get("span").contains(contractName),
    contractEditButton: () => this.action.get("button").contains("Edit"),
    existingContractWarning: () =>
      this.action.get("p").contains(this.existingContractWarning),
    autoPopulatedField: (fieldLabel) =>
      this.action.xpath(
        `//label[contains(text(), "${fieldLabel}")]/following-sibling::div/input`,
      ),
    contractDeleteButton: (contractName) =>
      this.action.xpath(
        `//span[text()="${contractName}"]/ancestor::td/ancestor::tr//td//span//button`,
      ),
    confirmDeleteButton: () => this.action.get("button").contains("Delete"),
    contractDetails: {
      contractName: () =>
        this.action.get("p").contains("Contract Name").siblings().eq(0),
      estimationName: () =>
        this.action.get("p").contains("Estimation Name").siblings().eq(0),
      pricingName: () =>
        this.action.get("p").contains("Pricing Name").siblings().eq(0),
      contractType: () =>
        this.action.get("p").contains("Contract Type").siblings().eq(0),
      paymentTerms: () =>
        this.action
          .get("p")
          .contains("Payment Terms Contract")
          .siblings()
          .eq(0),
      startDate: () =>
        this.action.get("p").contains("Start Date").siblings().eq(0),
      endDate: () => this.action.get("p").contains("End Date").siblings().eq(0),
    },
    contractUploadSection: {
      uploadField: () => this.action.get('input[type="file"]'),
      sowAmountField: () => this.action.get("p").contains("SOW Amount"),
      startDateField: () => this.action.get("p").contains("Start Date"),
      endDateField: () => this.action.get("p").contains("End Date"),
      uploadConfirmationMessage: () =>
        this.action.get("div").contains("Total contract amount"),
      uploadConfirmButton: () => this.action.get("button").contains("Confirm"),
    },
    createContractButton: () =>
      this.action.get("button").contains("Create Contract"),
  };

  constructor() {
    this.action = new Action();
    this.existingContractWarning =
      "This estimation and pricing combination has already " +
      "been assigned to a contract. You cannot create a new contract " +
      "using the same configuration.";
  }

  visit(clientName) {
    this.action.visit("/dashboard");
    this.elements.clientRecord(clientName).click();
    this.elements.sowContractNavigation().click();
    this.elements.contractsNavigation().click();
  }

  openAddContractPopup() {
    this.elements.addContractButton().click();
  }

  fillContractName(contractName) {
    this.elements.contractNameInput().click().type(contractName);
  }

  selectEstimationName(estimationName) {
    this.elements.estimationNameSelect().selectFromDropdown(estimationName);
  }

  selectPricingName(pricingName) {
    this.elements.pricingNameSelect().selectFromDropdown(pricingName);
  }

  selectContractType(contractType) {
    this.elements.contractTypeSelect().selectFromDropdown(contractType);
  }

  selectPaymentTerms(paymentTerms) {
    this.elements.paymentTermsSelect().selectFromDropdown(paymentTerms);
  }

  openContractDetails(contractName) {
    this.elements.contractRecord(contractName).click();
  }

  uploadContractFile(fileName) {
    this.elements.contractUploadSection
      .uploadField()
      .uploadFile(fileName, { force: true });
  }

  deleteContract(contractName) {
    this.elements.contractDeleteButton(contractName).click();
    this.elements.confirmDeleteButton().click();
  }

  clickCreateContractButton() {
    this.elements.createContractButton().click();
  }

  clickConfirmUploadButton() {
    this.elements.contractUploadSection.uploadConfirmButton().click();
  }

  expectContractAdded(contractName) {
    this.elements.contractRecord(contractName).should("be.visible");
  }

  expectContractDeleted(contractName) {
    this.elements.contractRecord(contractName).should("not.exist");
  }

  expectContractsHeaderVisible() {
    this.elements.contractsHeader().should("be.visible");
  }

  expectAddContractHeaderVisible() {
    this.elements.addContractHeader().should("be.visible");
  }

  expectPopulatedContractAmountToBe(sowAmount) {
    this.elements
      .autoPopulatedField("Total Contract Amount")
      .should("contain", sowAmount);
  }

  expectPopulatedStartDateToBe(startDate) {
    this.elements
      .autoPopulatedField("Contract Start Date")
      .should("contain", startDate);
  }

  expectPopulatedEndDateToBe(endDate) {
    this.elements
      .autoPopulatedField("Contract End Date")
      .should("contain", endDate);
  }

  expectContractNameToBe(contractName) {
    this.elements.contractDetails
      .contractName()
      .should("contain", contractName);
  }

  expectEstimationNameToBe(estimationName) {
    this.elements.contractDetails
      .estimationName()
      .should("contain", estimationName);
  }

  expectPricingNameToBe(pricingName) {
    this.elements.contractDetails.pricingName().should("contain", pricingName);
  }

  expectContractTypeToBe(contractType) {
    this.elements.contractDetails
      .contractType()
      .should("contain", contractType);
  }

  expectPaymentTermsToBe(paymentTerms) {
    this.elements.contractDetails
      .paymentTerms()
      .should("contain", paymentTerms);
  }

  expectStartDateToBe(startDate) {
    this.elements.contractDetails.startDate().should("contain", startDate);
  }

  expectEndDateToBe(endDate) {
    this.elements.contractDetails.endDate().should("contain", endDate);
  }

  expectExistingContractWarning() {
    this.elements.existingContractWarning().should("be.visible");
  }

  expectParsedSOWAmountToBe(sowAmount) {
    this.elements.contractUploadSection
      .sowAmountField()
      .should("contain", sowAmount);
  }

  expectParsedStartDateToBe(startDate) {
    this.elements.contractUploadSection
      .startDateField()
      .should("contain", startDate);
  }

  expectParsedEndDateToBe(endDate) {
    this.elements.contractUploadSection
      .endDateField()
      .should("contain", endDate);
  }

  expectUploadConfirmationMessageVisible() {
    this.elements.contractUploadSection
      .uploadConfirmationMessage()
      .should("be.visible");
  }

  expectUploadConfirmationMessageToHave(contractAmount) {
    this.elements.contractUploadSection
      .uploadConfirmationMessage()
      .should("contain", contractAmount);
  }
}

export { Contract };
