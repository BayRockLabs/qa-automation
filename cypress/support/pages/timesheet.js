import { BasePage } from "./basePage";

export default class Timesheet extends BasePage {
  elements = {
    managerViewButton: () => this.elements.getButtonContaining("Manager View"),
    ongoingProjectsButton: () =>
      this.elements.getButtonContaining("Ongoing Projects"),
    completedProjectsButton: () =>
      this.elements.getButtonContaining("Completed Projects"),
    timesheetApproveSearchBar: () => cy.get(),
  };

  constructor() {
    super();
    this.elements = {
      ...super.elements,
      ...this.elements,
    };
  }

  visit() {
    cy.visit(this.urls.timesheet);
  }

  clickManagerViewButton() {
    this.elements.managerViewButton().click();
  }

  clickOngoingProjectsButton() {
    this.elements.ongoingProjectsButton().click();
  }
  clickCompletedProjectsButton() {
    this.elements.completedProjectsButton().click();
  }

  visitTimeOffListing() {
    this.elements;
  }

  visitUnplannedHoursListing() {}

  clickSubmitTimesheetButton() {}
}
