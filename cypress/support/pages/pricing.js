import { Action } from "../actions/action";

class Pricing {
  elements = {
    clientRecord: (clientName) => this.action.get("span").contains(clientName),
    effortEstimationTab: () => this.action.get("div").contains("Estimation"),
    pricingTab: () => this.action.get("div").contains("Pricing"),
    pricingHeader: () => this.action.get("p").contains("Pricing"),
    addPricingHeader: () => this.action.get("p").contains("Add Pricing"),
    pricingOverviewHeader: (pricingName) =>
      this.action.get("p").contains(pricingName + " Overview"),
    addPricingButton: () => this.action.get("button").contains("Add Pricing"),
    addPricingHeader: () => this.action.get("span").contains("Add Pricing"),
    pricingNameInput: () => this.action.get('[name="pricingName"]'),
    estimationNameSelect: () => this.action.get('[role="combobox"]'),
    discountInput: () => this.action.get('[name="discount"]'),
    createPricingButton: () =>
      this.action.get("button").contains("Create Pricing"),
    pricingRecord: (pricingName) =>
      this.action.get("span").contains(pricingName),
    pricingDeleteButton: (pricingName) =>
      this.action.xpath(
        `//tr[.//span[text()='${pricingName}']]//span[button]/button`,
      ),
    deleteConfirmButton: () => this.action.get("button").contains("Delete"),
    addPricing: {
      prePopulatedField: (fieldLabel) =>
        this.action.xpath(
          `//label[text()="${fieldLabel}"]/following-sibling::div/input`,
        ),
    },
    pricingDetails: {
      pricingName: () =>
        this.action.get("p").contains("Pricing Name").siblings().eq(0),
      estimationName: () =>
        this.action.get("p").contains("Estimation Name").siblings.eq(0),
      totalCostToCompany: () =>
        this.action.get("p").contains("Total Cost to company").siblings.eq(0),
      totalBillAmount: () =>
        this.action
          .get("p")
          .contains("Total Bill Amount(Customer)")
          .siblings.eq(0),
      grossMargin: () =>
        this.action.get("p").contains("Gross Margin").siblings.eq(0),
      discount: () =>
        this.action.get("p").contains("Discount %").siblings.eq(0),
      finalOfferPrice: () =>
        this.action.get("p").contains("Final Offer Price").siblings.eq(0),
      finalOfferGrossMargin: () =>
        this.action
          .get("p")
          .contains("Final Offer Gross Margin")
          .siblings.eq(0),
      finalOfferGrossMarginPercent: () =>
        this.action
          .get("p")
          .contains("Final Offer Gross Margin(%)")
          .siblings.eq(0),
    },
  };

  constructor() {
    this.action = new Action();
  }

  visit(clientName) {
    this.action.visit("/dashboard");
    this.elements.clientRecord(clientName).click();
    this.elements.effortEstimationTab().click();
    this.elements.pricingTab().click();
  }

  openAddPricingPopup() {
    this.elements.addPricingButton().click();
  }

  fillPricingName(pricingName) {
    this.elements.pricingNameInput().type(pricingName);
  }

  selectEstimationName(estimationName) {
    this.elements.estimationNameSelect().selectFromDropdown(estimationName);
  }

  fillDiscount(discount) {
    this.elements.discountInput().type(discount);
  }

  clickCreatePricingButton() {
    this.elements.createPricingButton().click();
  }

  deletePricing(pricingName) {
    this.elements.pricingDeleteButton(pricingName).click();
    this.elements.deleteConfirmButton().click();
  }

  openPricingDetails(pricingName) {
    this.elements.pricingRecord(pricingName).click();
  }

  expectPricingHeaderVisible() {
    this.elements.pricingHeader().should("be.visible");
  }

  expectAddPricingHeaderVisible() {
    this.elements.addPricingHeader().should("be.visible");
  }

  expectPricingOverviewHeaderVisible(pricingName) {
    this.elements.pricingOverviewHeader(pricingName).should("be.visible");
  }

  expectPricingAdded(pricingName) {
    this.elements.pricingRecord(pricingName).should("be.visible");
  }

  expectPricingDeleted(pricingName) {
    this.elements.pricingRecord(pricingName).should("not.exist");
  }

  expectPricingNameToBe(pricingName) {
    this.elements.pricingDetails.pricingName().should("contain", pricingName);
  }

  expectEstimationNameToBe(estimationName) {
    this.elements.pricingDetails
      .estimationName()
      .should("contain", estimationName);
  }

  expectTotalCostToCompanyToBe(totalCostToCompany) {
    this.elements.pricingDetails
      .totalCostToCompany()
      .should("contain", totalCostToCompany);
  }

  expectTotalBillAmountToBe(totalBillAmount) {
    this.elements.pricingDetails
      .totalBillAmount()
      .should("contain", totalBillAmount);
  }

  expectGrossMarginToBe(grossMargin) {
    this.elements.pricingDetails.grossMargin().should("contain", grossMargin);
  }

  expectDiscountToBe(discount) {
    this.elements.pricingDetails.discount().should("contain", discount);
  }

  expectFinalOfferPriceToBe(finalOfferPrice) {
    this.elements.pricingDetails
      .finalOfferPrice()
      .should("contain", finalOfferPrice);
  }

  expectFinalOfferGrossMarginToBe(finalOfferGrossMargin) {
    this.elements.pricingDetails
      .finalOfferGrossMargin()
      .should("contain", finalOfferGrossMargin);
  }

  expectFinalOfferGrossMarginPercentToBe(finalOfferGrossMarginPercent) {
    this.elements.pricingDetails
      .finalOfferGrossMarginPercent()
      .should("contain", finalOfferGrossMarginPercent);
  }
}

export { Pricing };
