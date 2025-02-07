class BasePage {
  elements = {
    getButtonContaining: (buttonText) => cy.get("button").contains(buttonText),
  };

  urls = {};

  loadUrls() {
    cy.fixture("urls.json").then((urlsData) => {
      this.urls = urlsData;
    });
  }

  visit() {
    cy.visit(this.urls.login);
  }

  clickButtonContaining(buttonText) {
    this.elements.getButtonContaining(buttonText).click();
  }
}

export { BasePage };
