import { Action } from "../actions/action";

class Allocations {
  elements = {
    clientRecord: (clientName) => this.action.get("span").contains(clientName),
    allocationTab: () => this.action.get("div").contains("Allocations"),
    addAllocationButton: () =>
      this.action.get("button").contains("Add Allocation"),
    selectContractOption: () => this.action.get('[role="combobox"]').eq(0),
    allocationNameInput: () => this.action.get('[type="text"]').eq(1),
    clickResourceselect: () => this.action.get("#dropdown-basic"),
    selectResourceOption: (resourceName) =>
      this.action.get("a.dropdown-item").contains(resourceName),
    selectCreateAllocationButton: () =>
      this.action.get("button").contains("Create Allocation"),
    editIcon: () => this.action.get('[data-testid="ArrowForwardIosIcon"]'),
    errorMessage: () =>
      this.action
        .get("p")
        .contains(
          "An allocation with this contract and estimation combination already exists.",
        ),
    clickHereToView: () => this.action.get("p").contains("Click here to view"),
    AllocationDeleteButton: (AllocationName) =>
      this.action.xpath(
        `//span[text()="${AllocationName}"]/ancestor::td/ancestor::tr//td//span//button`,
      ),
    deleteConfirmButton: () => this.action.get("button").contains("Delete"),
    AllocationDetails: {
      contractName: () =>
        this.action.get("p").contains("Contract Name").siblings().eq(0),
      estimationName: () =>
        this.action.get("p").contains(" Estimation Name​").siblings().eq(0),
      allocationName: () =>
        this.action.get("p").contains("Allocation Name").siblings().eq(0),
      allocationCount: () =>
        this.action.get("p").contains("Allocation Count").siblings().eq(0),
      startDate: () =>
        this.action.get("p").contains("Start Date").siblings().eq(0),
      endDate: () => this.action.get("p").contains("End Date").siblings().eq(0),
      totalBilableHours: () =>
        this.action.get("p").contains("Total Billable Hrs").siblings().eq(0),
      backIcon: () => this.action.get('[alt="BackIcon"]'),
    },
  };

  constructor() {
    this.action = new Action();
  }

  visit(clientName) {
    this.action.visit("/dashboard");
    this.elements.clientRecord(clientName).click();
    this.elements.allocationTab().click();
  }

  clickAddAllocationButton() {
    this.elements.addAllocationButton().click();
  }

  selectAllocationContractOption() {
    this.elements.selectContractOption().selectFromDropdown("contract2");
  }

  fillAllocationName(allocationName) {
    this.elements
      .allocationNameInput()
      .click()
      .type(allocationName, { force: true });
  }

  clickOnSelectResource() {
    this.elements.clickResourceselect().click();
  }

  selectResourceFromDropdown(resourceName) {
    this.elements.selectResourceOption(resourceName).click();
  }

  clickOnCreateAllocationButton() {
    this.elements.selectCreateAllocationButton().click();
  }

  clickOnEditIcon() {
    this.elements.editIcon().click();
  }

  expectedAllocationContractNameToBe(contractName) {
    this.elements.AllocationDetails.contractName().should(
      "contain",
      contractName,
    );
  }

  expectedAllocationEstimationNameToBe(poCntractName) {
    this.elements.AllocationDetails.estimationName().should(
      "contain",
      poCntractName,
    );
  }

  expectedAllocationNameToBe(allocationName) {
    this.elements.AllocationDetails.allocationName().should(
      "contain",
      allocationName,
    );
  }

  expectedAllocationCountToBe(allocationCount) {
    this.elements.AllocationDetails.allocationCount().should(
      "contain",
      allocationCount,
    );
  }

  expectedAllocationStartDateToBe(startDate) {
    this.elements.AllocationDetails.startDate().should("contain", startDate);
  }

  expectedAllocationEndDateToBe(endDate) {
    this.elements.AllocationDetails.endDate().should("contain", endDate);
  }

  expectedTotalBillHrsToBe(totalBillHours) {
    this.elements.AllocationDetails.totalBilableHours().should(
      "contain",
      totalBillHours,
    );
  }

  clickOnBackIcon() {
    this.elements.AllocationDetails.backIcon().click();
  }

  expectedErrorMessageToBe() {
    this.elements.errorMessage().should("be.visible");
  }

  clickOnHyperLinkToView() {
    this.elements.clickHereToView().click();
  }

  deleteAllocation(AllocationName) {
    this.elements.AllocationDeleteButton(AllocationName).click();
    this.elements.deleteConfirmButton().click();
  }
}
export { Allocations };
