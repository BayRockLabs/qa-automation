import { ProgrammaticTestSetup } from "../support/actions/setup";
import { Timesheet } from "../support/pages/timesheet";

const testSetup = new ProgrammaticTestSetup();
const timesheetTest = new Timesheet();
const user = Cypress.env("USER");

describe("Timesheet recall and approval", () => {
  before(() => {
    testSetup.login(user);
    testSetup.loadSetupData();
    testSetup.deleteClient("cypress client");
    testSetup.createClient();
    testSetup.createEstimation();
    testSetup.createPricing();
    testSetup.createSOWContract();
    testSetup.createAllocation();
  });

  it("Checks if the setup is done", () => {
    
  });
});
