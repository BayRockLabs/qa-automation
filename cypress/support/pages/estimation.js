import { Action } from "../actions/action";
import { hexToRGB } from "../utils/common";

class Estimation {
  elements = {
    clientRecord: (clientName) => this.action.get("span").contains(clientName),
    effortEstimationNavigation: () =>
      this.action.get("div").contains("Effort Estimation"),
    estimationNavigation: () => this.action.get("div").contains("Estimation"),
    estimationsHeader: () => this.action.get("p").contains("Estimations"),
    effortEstimationHeader: () =>
      this.action.get("h4").contains("Effort Estimation"),
    addEstimationButton: () =>
      this.action.get("button").contains("Add Estimation"),
    estimationNameInput: () =>
      this.action.xpath(
        '//div[contains(text(), "Estimation Name")]/parent::*/following-sibling::div//input',
      ),
    billingTypeSelect: () => this.action.get("#outlined-select-contract-term"),
    clientNameField: (clientName) => this.action.get(`[value="${clientName}"]`),
    resourceRoleSelect: () => this.action.get("#tags-outlined"),
    skillSelect: () => this.action.get("#demo-multiple-checkbox"),
    invisibleOverlay: () => this.action.get("#menu-"),
    resourceRegionSelect: (IND) => this.action.get('[role="combobox"]').eq(-1),
    resourceStartDateInput: () =>
      this.action.get('[placeholder="yyyy-mm-dd"]').eq(0),
    resourceEndDateInput: () =>
      this.action.get('[placeholder="yyyy-mm-dd"]').eq(1),
    estimationHoursField: (estimatedHours) =>
      this.action.get(`[value="${estimatedHours}"]`),
    fullTimeSelect: () =>
      this.action.get("p").contains("Full Time").siblings().eq(0),
    addResourceButton: () =>
      this.action.get("button").contains("Add Resources"),
    createEstimationButton: () =>
      this.action.get("button").contains("Create Estimation"),
    estimationRecord: (estimationName) =>
      this.action.get("span").contains(estimationName),
    estimationDeleteButton: (estimationName) =>
      this.action.xpath(
        `//span[text()="${estimationName}"]/ancestor::td/ancestor::tr//td//span//button`,
      ),
    deleteConfirmButton: () => this.action.get("button").contains("Delete"),
    estimationCalendar: {
      icon: () => this.action.get('[data-testid="DateRangeIcon"]'),
      monthlyTab: () => this.action.get("button").contains("Monthly"),
      weeklyTab: () => this.action.get("button").contains("Weekly"),
      dailyTab: () => this.action.get("button").contains("Daily"),
      navLeftIcon: () => this.action.get('[data-testid="ChevronLeftIcon"]'),
      navRightIcon: () => this.action.get('[data-testid="ChevronRightIcon"]'),
      splitHoursField: () => this.action.get('[inputmode="numeric"]').eq(0),
      minHoursField: () => this.action.get('[inputmode="numeric"]').eq(1),
      maxHoursField: () => this.action.get('[inputmode="numeric"]').eq(2),
      cancelButton: () => this.action.get("button").contains("Cancel"),
      submitButton: () => this.action.get("button").contains("Submit"),
      checkBox: (option) =>
        this.action.xpath(
          `//p[contains(text(), '${option}')]/preceding-sibling::span/*[@type='checkbox']`,
        ),
      numericFields: () => this.action.get('[inputmode="numeric"]'),
      splitButton: () => this.action.get("button").contains("Split"),
      invalidSplitWarning: () =>
        this.action.get("h6").contains("Cannot distribute"),
    },
  };

  constructor() {
    this.action = new Action();
  }

  visit(clientName) {
    this.action.visit("/dashboard");
    this.elements.clientRecord(clientName).click();
    this.elements.estimationNavigation().click();
    this.elements.effortEstimationNavigation().click();
  }

  openAddEstimationPopup() {
    this.elements.addEstimationButton().click();
  }

  fillEstimationName(estimationName) {
    this.elements.estimationNameInput().click().type(estimationName);
  }

  selectBillingType(billingType) {
    this.elements.billingTypeSelect().selectFromDropdown(billingType);
  }

  expectPopulatedClientNameToBe(clientName) {
    this.elements
      .clientNameField(clientName)
      .should("have.attr", "value", clientName);
  }

  selectResourceRole(resourceRole) {
    this.elements.resourceRoleSelect().selectFromDropdown(resourceRole);
  }

  selectResourceSkill(selectSkill) {
    this.elements.skillSelect().selectFromDropdown(selectSkill);
    this.elements.invisibleOverlay().click("top");
  }

  selectResourceRegion(resourceRegion) {
    this.elements.resourceRegionSelect().selectFromDropdown(resourceRegion);
  }

  fillResourceStartDate(startDate) {
    this.elements.resourceStartDateInput().type(startDate);
  }

  fillResourceEndDate(endDate) {
    this.elements.resourceEndDateInput().type(endDate);
  }

  selectFullTime(fullTime) {
    this.elements.fullTimeSelect().click();
  }

  openEstimationCalendar() {
    this.elements.estimationCalendar.icon().click();
  }

  switchToMonthlyTab() {
    this.elements.estimationCalendar.monthlyTab().click();
  }

  expectMonthlyTabActive() {
    this.elements.estimationCalendar
      .monthlyTab()
      .should("have.css", "background-color", hexToRGB("#8056F7"));
  }

  switchToWeeklyTab() {
    this.elements.estimationCalendar.weeklyTab().click();
  }

  expectWeeklyTabActive() {
    this.elements.estimationCalendar
      .weeklyTab()
      .should("have.css", "background-color", hexToRGB("#8056F7"));
  }

  switchToDailyTab() {
    this.elements.estimationCalendar.dailyTab().click();
  }

  expectDailyTabActive() {
    this.elements.estimationCalendar
      .dailyTab()
      .should("have.css", "background-color", hexToRGB("#8056F7"));
  }

  clickLeftIcon() {
    this.elements.estimationCalendar.navLeftIcon().click();
  }

  clickRightIcon() {
    this.elements.estimationCalendar.navRightIcon().click();
  }

  fillSplitHours(splitHours) {
    this.elements.estimationCalendar.splitHoursField().clear().type(splitHours);
  }

  fillMinHours(minHours) {
    this.elements.estimationCalendar.minHoursField().clear().type(minHours);
  }

  fillMaxHours(maxHours) {
    this.elements.estimationCalendar.maxHoursField().clear().type(maxHours);
  }

  selectAllOption() {
    this.elements.estimationCalendar.checkBox("Select All").click();
  }

  splitHours() {
    this.elements.estimationCalendar.splitButton().click();
  }

  submitEstimation() {
    this.elements.estimationCalendar.submitButton().click();
  }

  closeEstimationCalendar() {
    this.elements.estimationCalendar.cancelButton().click();
  }

  clickAddResourceButton() {
    this.elements.addResourceButton().click();
  }

  clickCreateEstimationButton() {
    this.elements.createEstimationButton().click();
  }

  deleteEstimation(estimationName) {
    this.elements.estimationDeleteButton(estimationName).click();
    this.elements.deleteConfirmButton().click();
  }

  expectEstimationsHeaderVisible() {
    this.elements.estimationsHeader().should("be.visible");
  }

  expectEfforEstimationHeaderVisible() {
    this.elements.effortEstimationHeader().should("be.visible");
  }

  expectEstimationCreated(estimationName) {
    this.elements.estimationRecord(estimationName).should("be.visible");
  }

  expectEstimationDeleted(estimationName) {
    this.elements.estimationRecord(estimationName).should("not.exist");
  }

  expectEstimatedHoursToBe(estimatedHours) {
    this.elements.estimationHoursField(estimatedHours).should("be.visible");
  }

  expectSplitHoursToBe(splitHours) {
    this.elements.estimationCalendar
      .splitHoursField()
      .should("have.attr", "value", splitHours);
  }

  expectMinHoursToBe(minHours) {
    this.elements.estimationCalendar
      .minHoursField()
      .should("have.attr", "value", minHours);
  }

  expectMaxHoursToBe(maxHours) {
    this.elements.estimationCalendar
      .maxHoursField()
      .should("have.attr", "value", maxHours);
  }

  expectInvalidSplitWarning() {
    this.elements.estimationCalendar
      .invalidSplitWarning()
      .scrollIntoView()
      .should("be.visible");
  }

  /**
   * Asserts that the split hours are within the valid range and add up to the total split hours.
   */
  validateSplit(totalHours, minHours, maxHours) {
    this.action.get('[inputmode="numeric"]').element.then(($items) => {
      let totalSplitHours = 0;
      const itemsToCheck = Array.from($items.slice(3));

      // Loop over all the items and validate their values
      itemsToCheck.forEach((item) => {
        // In the daily tab, inactive dates have an attribute "disabled" with no value.
        if (item.hasAttribute("disabled")) {
          return;
        }
        let itemIntegerValue = parseInt(item.value);
        this.action.wrap(itemIntegerValue).should("be.gte", minHours);
        this.action.wrap(itemIntegerValue).should("be.lte", maxHours);
        totalSplitHours += itemIntegerValue;
      });

      // Check if the total hours in the fields match the Split hours field
      this.expectSplitHoursToBe(totalSplitHours);
      this.expectSplitHoursToBe(totalHours);
    });
  }
}

export { Estimation };
