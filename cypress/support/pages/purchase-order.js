import { Action } from "../actions/action";

class PurchaseOrder {
  elements = {
    clientRecord: (clientName) => this.action.get("span").contains(clientName),
    sowContractTab: () => this.action.get("div").contains("SOWContract"),
    purchaseOrderTab: () => this.action.get("div").contains("Purchase Orders"),
    addPurchaseOrderButton: () =>
      this.action.get("button").contains("Add Purchase Order"),
    checkPoAlertMessage: () =>
      this.action
        .get("h6")
        .contains("Please begin by uploading your Purchase Order (PO)."),
    uploadField: () => this.action.get('input[type="file"]'),
    uploadFieldTwo: () => this.action.get('input[type="file"]'),
    selectProceedButton: () => this.action.get("button").contains("Proceed"),
    poNameInput: () =>
      this.action.xpath(
        '//label[contains(., "PO Name")]/following-sibling::div[1]/input',
      ),
    poOrderInput: () =>
      this.action.xpath(
        '//label[contains(., "Purchase Order")]/following-sibling::div[1]/input',
      ),
    poAmountInput: () =>
      this.action
        .xpath(
          '//label[.//div[contains(text(), "PO Amount")]]/following-sibling::div[1]//input',
        )
        .eq(0),
    poStartDateInput: () => this.action.get('[placeholder="yyyy-mm-dd"]').eq(0),
    poEndDateInput: () => this.action.get('[placeholder="yyyy-mm-dd"]').eq(1),
    selectPurchaseOrderButton: () =>
      this.action.get("button").contains("Create Purchase Order"),
    purchaseOrderDeleteButton: (purchaseOrderName) =>
      this.action.xpath(
        `//span[text()="${purchaseOrderName}"]/ancestor::td/ancestor::tr//td//span//button`,
      ),
    deleteConfirmButton: () => this.action.get("button").contains("Delete"),
    selectAssignPurchaseOrderButton: () =>
      this.action.get("button").contains("Assign Purchase Order"),
    selectContractName: () => this.action.get('[role="combobox"]').eq(0),
    selectPoName: () => this.action.get('[role="combobox"]').eq(1),
    assignAmount: () => this.action.get('input[type="number"]'),
    purchaseOrderDetails: {
      editIcon: () => this.action.get('[data-testid="ArrowForwardIosIcon"]'),
      contractName: () =>
        this.action.get("p").contains("Contract Name").siblings().eq(0),
      poName: () => this.action.get("p").contains("PO Name").siblings().eq(0),
      purchaseOrder: () =>
        this.action.get("p").contains("Purchase Order").siblings().eq(0),
      poAmount: () =>
        this.action.get("p").contains("PO Amount").siblings().eq(0),
      orderDate: () =>
        this.action.get("p").contains("Order Date").siblings().eq(0),
      printDate: () =>
        this.action.get("p").contains("Print Date").siblings().eq(0),
      backIcon: () => this.action.get('[alt="BackIcon"]'),
    },
  };
  constructor() {
    this.action = new Action();
  }

  visit(clientName) {
    this.action.visit("/dashboard");
    this.elements.clientRecord(clientName).click();
    this.elements.sowContractTab().click();
    this.elements.purchaseOrderTab().click();
  }

  clickAddPurchaseOrderButton() {
    this.elements.addPurchaseOrderButton().click();
  }

  expectPoAlertMessage() {
    this.elements.checkPoAlertMessage().should("be.visible");
  }

  uploadPurchaseOrderFile(filePath) {
    this.elements.uploadField().uploadFile(filePath, { force: true });
  }

  uploadValidPurchaseOrderFile(filePath) {
    this.elements.uploadFieldTwo().uploadFile(filePath, { force: true });
  }

  clickOnProceedButton() {
    this.elements.selectProceedButton().click();
  }

  fillPoName(purchaseOrderName) {
    this.elements.poNameInput().type(purchaseOrderName, { force: true });
  }

  fillPoOrder(purchaseOrderNumber) {
    this.elements.poOrderInput().type(purchaseOrderNumber, { force: true });
  }

  fillPoAmount(poAmount) {
    this.elements
      .poAmountInput()
      .should("be.visible")
      .type(poAmount, { force: true });
  }

  fillPoStartDate(date) {
    this.elements.poStartDateInput().type(date);
  }

  fillPoEndDate(date1) {
    this.elements.poEndDateInput().type(date1);
  }

  clickOnCreatePurchaseOrderButton() {
    this.elements.selectPurchaseOrderButton().click();
  }

  clickOnEditIcon() {
    this.elements.purchaseOrderDetails.editIcon().click();
  }

  expectedContractNameToBe(poCntractName) {
    this.elements.purchaseOrderDetails
      .contractName()
      .should("contain", poCntractName);
  }

  expectedPoNameToBe(purchaseOrderName) {
    this.elements.purchaseOrderDetails
      .poName()
      .should("contain", purchaseOrderName);
  }

  expectedpurchaseOrderToBe(POorder) {
    this.elements.purchaseOrderDetails
      .purchaseOrder()
      .should("contain", POorder);
  }

  expectedpoAmountToBe(POAmount) {
    this.elements.purchaseOrderDetails.poAmount().should("contain", POAmount);
  }

  expectedOrderDateToBe(poOrderDate) {
    this.elements.purchaseOrderDetails
      .orderDate()
      .should("contain", poOrderDate);
  }

  expectedPrintDateToBe(PoPrintDate) {
    this.elements.purchaseOrderDetails
      .printDate()
      .should("contain", PoPrintDate);
  }

  clickOnBackIcon() {
    this.elements.purchaseOrderDetails.backIcon().click();
  }

  deletePurchaseOrder(purchaseOrderName) {
    this.elements.purchaseOrderDeleteButton(purchaseOrderName).click();
    this.elements.deleteConfirmButton().click();
  }
}
export { PurchaseOrder };
