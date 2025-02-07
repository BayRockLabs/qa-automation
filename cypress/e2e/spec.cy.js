import { Action } from "../support/actions/action";
import { ClientManagement } from "../support/pages/client_management";
import { Estimation } from "../support/pages/estimation";
import { Pricing } from "../support/pages/pricing";
import { Contract } from "../support/pages/contract";
import { Milestone } from "../support/pages/milestone";
import { PurchaseOrder } from "../support/pages/purchase-order";
import { Allocations } from "../support/pages/allocations";

let data;
const action = new Action();

before(() => {
  let user = {
    email: Cypress.env("username"),
    password: Cypress.env("password"),
  };
  action.c2cLogin(user);
  action.loadFixture("clientData.json").then((clientData) => {
    data = clientData;
  });
});

describe("Client Management Module", () => {
  const testClient = new ClientManagement();

  it("Visits the client management page", () => {
    testClient.visit();
    //testClient.action.urlShouldContain('/dashboard');
    testClient.expectClientManagementHeaderVisible();
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
    testClient.clickNextButton();
  });

  it("Creates new client", () => {
    testClient.clickCreateClientButton();
    testClient.expectClientAdded(data.client.name);
  });

  it("Verifies client details", () => {
    testClient.openClientDetails(data.client.name);
    testClient.expectClientNameToBe(data.client.name);
    testClient.expectClientAddressToBe(data.client.address);
    testClient.expectClientCityToBe(data.client.city);
    testClient.expectClientStateToBe(data.client.state);
    testClient.expectClientCountryToBe(data.client.countryShort);
    testClient.expectClientZipCodeToBe(data.client.zipCode);
  });
});

describe("Client Management Module", () => {
  const testClient = new ClientManagement();

  it("Visits the client management page", () => {
    testClient.visit();
    //testClient.action.urlShouldContain('/dashboard');
    testClient.expectClientManagementHeaderVisible();
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
    testClient.clickNextButton();
  });

  it("Creates new client", () => {
    testClient.clickCreateClientButton();
    testClient.expectClientAdded(data.client.name);
  });

  it("Verifies client details", () => {
    testClient.openClientDetails(data.client.name);
    testClient.expectClientNameToBe(data.client.name);
    testClient.expectClientAddressToBe(data.client.address);
    testClient.expectClientCityToBe(data.client.city);
    testClient.expectClientStateToBe(data.client.state);
    testClient.expectClientCountryToBe(data.client.countryShort);
    testClient.expectClientZipCodeToBe(data.client.zipCode);
  });

  it.skip("Deletes the test client", () => {
    testClient.visit(data.client.name);
    testClient.deleteClient(data.client.name);
    testClient.expectClientDeleted(data.client.name);
  });
});

describe("Estimation Module", () => {
  const testEstimation = new Estimation();
  it("Goes to client estimations", () => {
    testEstimation.visit(data.client.name);
    testEstimation.expectEstimationsHeaderVisible();
  });

  it("Opens the add estimation popup", () => {
    testEstimation.openAddEstimationPopup();
    testEstimation.expectEfforEstimationHeaderVisible();
  });

  it("Fills out estimation data", () => {
    testEstimation.fillEstimationName(data.estimation.name);
    testEstimation.selectBillingType(data.billing.enterprise);
    testEstimation.expectPopulatedClientNameToBe(data.client.name);
    testEstimation.selectResourceRole(data.resourceRole.uxEng);
    testEstimation.selectResourceSkill(data.estimation.skill);
    testEstimation.selectResourceRegion(data.region.ind);
    testEstimation.fillResourceStartDate(data.estimation.startDate);
    testEstimation.fillResourceEndDate(data.estimation.endDate);
    testEstimation.expectEstimatedHoursToBe(
      data.estimation.totalWorkingDays * 8,
    );
    testEstimation.selectFullTime();
  });

  it("Invalid monthly split - not enough minumum hours per month", () => {
    testEstimation.openEstimationCalendar();
    testEstimation.switchToMonthlyTab();
    testEstimation.expectMonthlyTabActive();
    let totalHours = data.estimation.totalWorkingDays * 8;
    let minHours = 0;
    let maxHours = 175;
    testEstimation.fillSplitHours(totalHours);
    testEstimation.fillMinHours(minHours);
    testEstimation.fillMaxHours(maxHours);
    testEstimation.selectAllOption();
    testEstimation.splitHours();
    testEstimation.expectInvalidSplitWarning();
    testEstimation.closeEstimationCalendar();
  });

  it("Invalid monthly split - minimum hours per month too high", () => {
    testEstimation.openEstimationCalendar();
    testEstimation.switchToMonthlyTab();
    testEstimation.expectMonthlyTabActive();
    let totalHours = data.estimation.totalWorkingDays * 8;
    let minHours = 176;
    let maxHours = 250;
    testEstimation.fillSplitHours(totalHours);
    testEstimation.fillMinHours(minHours);
    testEstimation.fillMaxHours(maxHours);
    testEstimation.selectAllOption();
    testEstimation.splitHours();
    testEstimation.expectInvalidSplitWarning();
    testEstimation.closeEstimationCalendar();
  });

  it("Invalid monthly split - maximum hours per month too low", () => {
    testEstimation.openEstimationCalendar();
    testEstimation.switchToMonthlyTab();
    testEstimation.expectMonthlyTabActive();
    let totalHours = data.estimation.totalWorkingDays * 8;
    let minHours = 175;
    let maxHours = 176;
    testEstimation.fillSplitHours(totalHours);
    testEstimation.fillMinHours(minHours);
    testEstimation.fillMaxHours(maxHours);
    testEstimation.selectAllOption();
    testEstimation.splitHours();
    testEstimation.expectInvalidSplitWarning();
    testEstimation.closeEstimationCalendar();
  });

  it("Valid monthly split", () => {
    testEstimation.openEstimationCalendar();
    testEstimation.switchToMonthlyTab();
    testEstimation.expectMonthlyTabActive();
    let totalHours = 900;
    let minHours = 0;
    let maxHours = 184;
    testEstimation.fillSplitHours(totalHours);
    testEstimation.fillMinHours(minHours);
    testEstimation.fillMaxHours(maxHours);
    testEstimation.selectAllOption();
    testEstimation.splitHours();
    testEstimation.validateSplit(totalHours, minHours, maxHours);
    testEstimation.closeEstimationCalendar();
  });

  it("Adds the new estimation.", () => {
    testEstimation.clickAddResourceButton();
    testEstimation.clickCreateEstimationButton();
    testEstimation.expectEstimationCreated(data.estimation.name);
  });
});

describe("Pricing Module", () => {
  const testPricing = new Pricing();
  let totalCostToCompany;
  let totalBillAmount;
  let grossMarginPercent;
  let finalOfferPrice;
  let finalOfferGrossMargin;
  let finalOfferGrossMarginPercent;

  it("Goes to client pricing", () => {
    testPricing.visit(data.client.name);
    testPricing.expectPricingHeaderVisible();
  });

  it("Opens the add pricing popup", () => {
    testPricing.openAddPricingPopup();
    testPricing.expectAddPricingHeaderVisible();
  });

  it("Enters pricing name", () => {
    testPricing.fillPricingName(data.pricing.name);
  });

  it("Selects estimation name", () => {
    testPricing.selectEstimationName(data.estimation.name);
    testPricing.fillDiscount(data.pricing.discount);
  });

  it("Creates new pricing", () => {
    testPricing.clickCreatePricingButton();
    testPricing.expectPricingAdded(data.pricing.name);
  });

  it("Opens pricing details", () => {
    testPricing.openPricingDetails(data.pricing.name);
    testPricing.expectPricingOverviewHeaderVisible(data.pricing.name);
  });

  it.skip("Verifies pricing details", () => {
    testPricing.expectPricingNameToBe(data.pricing.name);
    testPricing.expectEstimationNameToBe(data.estimation.name);
    testPricing.expectTotalCostToCompanyToBe(totalCostToCompany);
    testPricing.expectTotalBillAmountToBe(totalBillAmount);
    testPricing.expectDiscountToBe(data.pricing.discount);
    testPricing.expectFinalOfferPriceToBe(finalOfferPrice);
    testPricing.expectFinalOfferGrossMarginToBe(finalOfferGrossMargin);
    testPricing.expectFinalOfferGrossMarginPercentToBe(
      finalOfferGrossMarginPercent,
    );
  });
});

describe("Contract Module", () => {
  const testContract = new Contract();
  it("Opens the contracts for a client", () => {
    testContract.visit(data.client.name);
    testContract.expectContractsHeaderVisible();
    //testContract.action.urlShouldContain('/contracts');
  });

  it("Opens the add contract popup", () => {
    testContract.openAddContractPopup();
    testContract.expectAddContractHeaderVisible();
  });

  it("Selects estimation and pricing", () => {
    testContract.selectEstimationName(data.estimation.name);
    testContract.selectPricingName(data.pricing.name);
  });

  it("Fills out contract details", () => {
    testContract.fillContractName(data.contract.name);
    testContract.selectContractType(data.contractType.fixed);
    testContract.selectPaymentTerms(data.paymentTerm.net45);
  });

  it.skip("Verifies contract amount, start and end dates", () => {
    testContract.expectPopulatedContractAmountToBe("");
    testContract.expectPopulatedStartDateToBe(data.estimation.startDate);
    testContract.expectPopulatedEndDateToBe(data.estimation.endDate);
  });

  it("Uploads the SOW Contract file", () => {
    testContract.uploadContractFile("sowContractFile.pdf");
  });

  it("Confirms success SOW Contract file upload", () => {
    testContract.expectUploadConfirmationMessageVisible();
    testContract.expectUploadConfirmationMessageToHave(
      data.contract.parsedData.sowAmount,
    );
    testContract.clickConfirmUploadButton();
  });

  it("Verifies the parsed details for SOW Contract file", () => {
    testContract.expectParsedSOWAmountToBe(data.contract.parsedData.sowAmount);
    testContract.expectParsedStartDateToBe(data.contract.parsedData.startDate);
    testContract.expectParsedEndDateToBe(data.contract.parsedData.endDate);
  });

  it("Creates new contract", () => {
    testContract.clickCreateContractButton();
    testContract.expectContractAdded(data.contract.name);
  });
});

describe("Milestone Module", () => {
  const milestone = new Milestone();
  it("Visits the Milestone page", () => {
    milestone.visit(data.client.name);
    milestone.clickAddMilestoneButton();
  });

  it("should display the Add Milestone Header ", () => {
    milestone.expectAddMilestoneHeaderVisible();
  });

  it("select contract2 from dropdown", () => {
    milestone.selectContractName(data.contract.name);
    milestone.expectContractNameVisible(data.contract.name);
  });

  it("fill milestone name", () => {
    milestone.fillMilestoneName(data.milestone.name);
  });

  it("check start date ", () => {
    milestone.expectContractStartDateToBe(data.milestone.contractStartDate);
  });

  it("check total contract amount ", () => {
    milestone.expectTotalContractAmountToBe(data.milestone.totalContractAmount);
  });

  it("check end dates", () => {
    milestone.expectContractEndDateToBe(data.milestone.contractEndDate);
  });

  it("click on manual tab and fills milestone amount", () => {
    milestone.clickOnManualTab();
    milestone.action.waitFor(5000);
    milestone.fillMilestoneAmount(data.milestone.amount);
  });
});

describe("PurchaseOrder Module", () => {
  const purchaseOrder = new PurchaseOrder();
  it("visits purchase order page", () => {
    purchaseOrder.visit("Client 2");
  });

  it("opens purchase order popup", () => {
    purchaseOrder.clickAddPurchaseOrderButton();
  });

  it("check assert message is visible", () => {
    purchaseOrder.expectPoAlertMessage();
  });

  it("uploads invalid po document", () => {
    purchaseOrder.uploadPurchaseOrderFile("purchaseorder-document.pdf");
    purchaseOrder.action.waitFor(10000);
  });

  it("uploads Po document", () => {
    purchaseOrder.clickOnProceedButton();
    purchaseOrder.action.waitFor(10000);
  });

  it("it inputs PO name ", () => {
    purchaseOrder.fillPoName(data.purchaseOrder.name);
    purchaseOrder.action.waitFor(5000);
  });

  it("it inputs Po id", () => {
    purchaseOrder.fillPoOrder(data.purchaseOrder.orderID);
  });

  it("input po amount", () => {
    purchaseOrder.fillPoAmount(data.purchaseOrder.amount);
  });

  it("inputs po start date", () => {
    purchaseOrder.fillPoStartDate(data.purchaseOrder.startDate);
  });

  it("inputs po end date", () => {
    purchaseOrder.fillPoEndDate(data.purchaseOrder.endDate);
    purchaseOrder.clickOnCreatePurchaseOrderButton;
  });

  it("creates Purchase order", () => {
    purchaseOrder.clickOnCreatePurchaseOrderButton();
  });

  it("Verifies purchase order details", () => {
    purchaseOrder.clickOnEditIcon();
    purchaseOrder.expectedContractNameToBe(data.purchaseOrder.contractName);
    purchaseOrder.expectedPoNameToBe(data.purchaseOrder.name);
    purchaseOrder.expectedpurchaseOrderToBe(data.purchaseOrder.orderID);
    purchaseOrder.expectedpoAmountToBe(data.purchaseOrder.amount);
    purchaseOrder.expectedOrderDateToBe(data.purchaseOrder.startDate);
    purchaseOrder.expectedPrintDateToBe(data.purchaseOrder.endDate);
    purchaseOrder.clickOnBackIcon();
    purchaseOrder.action.waitFor(5000);
  });

  it("Deletes the purchase order", () => {
    purchaseOrder.deletePurchaseOrder(data.purchaseOrder.name);
  });

  it("verify valid po document", () => {
    purchaseOrder.clickAddPurchaseOrderButton();
  });

  it("uploads valid po document", () => {
    purchaseOrder.uploadValidPurchaseOrderFile("valid-po-document.pdf");
    purchaseOrder.action.waitFor(5000);
  });

  it("it inputs PO name ", () => {
    purchaseOrder.fillPoName(data.purchaseOrder.name);
    purchaseOrder.clickOnCreatePurchaseOrderButton();
  });

  it("Verifies purchase order details", () => {
    purchaseOrder.clickOnEditIcon();
    purchaseOrder.expectedContractNameToBe(data.purchaseOrder.contractName);
    purchaseOrder.expectedPoNameToBe(data.purchaseOrder.name);
    purchaseOrder.expectedpurchaseOrderToBe(
      data.purchaseOrder.purchaseOrderNumber,
    );
    purchaseOrder.expectedpoAmountToBe(data.purchaseOrder.validPoAmount);
    purchaseOrder.expectedOrderDateToBe(data.purchaseOrder.validPoOrderDate);
    purchaseOrder.expectedPrintDateToBe(data.purchaseOrder.validPoPrintDate);
    purchaseOrder.clickOnBackIcon();
    purchaseOrder.action.waitFor(5000);
  });
});

describe("allocations Module", () => {
  const allocations = new Allocations();

  it("visits allocations page", () => {
    allocations.visit("Client 2");
  });

  it("selects allocations button", () => {
    allocations.clickAddAllocationButton();
  });

  it("selects contract from dropdown", () => {
    allocations.selectAllocationContractOption();
  });

  it("it inputs allocation name", () => {
    allocations.fillAllocationName(data.allocation.allocationName);
  });

  it("it clicks on resource select ", () => {
    allocations.clickOnSelectResource();
  });

  it("it selects resource from dropdown", () => {
    allocations.selectResourceFromDropdown(data.allocation.ResourceName);
  });

  it("it creates allocations", () => {
    allocations.clickOnCreateAllocationButton();
  });

  it("click on edit icon", () => {
    allocations.clickOnEditIcon();
  });

  it("verify Allocation details", () => {
    allocations.expectedAllocationContractNameToBe(
      data.allocation.allocationContractName,
    );
    allocations.expectedAllocationEstimationNameToBe(
      data.allocation.estimationName,
    );
    allocations.expectedAllocationNameToBe(data.allocation.allocationName);
    allocations.expectedAllocationCountToBe(data.allocation.allocationCount);
    allocations.expectedAllocationStartDateToBe(data.allocation.startDate);
    allocations.expectedAllocationEndDateToBe(data.allocation.endDate);
    allocations.expectedTotalBillHrsToBe(data.allocation.totalBillableHours);
    allocations.clickOnBackIcon();
    allocations.action.waitFor(5000);
  });

  it("check error messasge", () => {
    allocations.clickAddAllocationButton();
    allocations.selectAllocationContractOption();
    allocations.expectedErrorMessageToBe();
    allocations.clickOnHyperLinkToView();
    allocations.clickOnBackIcon();
  });

  it("Deletes the Allocation", () => {
    allocations.deleteAllocation(data.allocation.allocationName);
  });
});
