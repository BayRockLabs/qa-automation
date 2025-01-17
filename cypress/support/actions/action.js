/**
 * @abstract Base class for high level actions.
 * Most functions return an instance of the Action class, allowing chaining of actions.
 */

import "cypress-real-events";

class Action {
    constructor() {
        this.element = null;
    }

    login(user) {
        this.element = cy.login(user);
        return this;
    }

    reload() {
        this.element = cy.reload();
        return this;
    }

    url() {
        this.element = cy.url();
        return this;
    }
    
    visit(url) {
        this.element = cy.visit(url);
        return this;
    }

    click(...args) {
        this.element.click(...args);
        return this;
    }

    get(...args) {
        this.element = cy.get(...args);
        return this;
    }

    eq(index) {
        this.element.eq(index);
        return this;
    }

    should(...args){
        this.element.should(...args);
        return this;
    }

    and(...args) {
        this.element.and(...args);
        return this;
    }

    contains(...args) {
        this.element.contains(...args);
        return this;
    }

    xpath(...args) {
        this.element = cy.xpath(...args);
        return this;
    }

    type(...args) {
        this.element.type(...args);
        return this;
    }

    clear(...args) {
        this.element.clear(...args);
        return this;
    }

    scrollIntoView(...args) {
        this.element.scrollIntoView(...args);
        return this;
    }

    siblings(...args) {
        this.element.siblings(...args);
        return this;
    }

    /**
     * 
     * Select an @element that has the text @label on it - for exact matches.
     */
    getElementMatching(element, label) {
        const regex = new RegExp(`^${label}$`);
        this.element = cy.get(element).contains(regex)
        return this;
    }

    /**
     * 
     * Select @option from a dropdown menu
     */
    selectFromDropdown(option) {
        this
            .click()
            .getElementMatching('li', option)
            .element
            .click();
        return this;
    }

    waitFor(milliseconds){
        this.element = cy.wait(milliseconds);
        return this;
    }

    loadFixture(fixtureName) {
        return cy.fixture(fixtureName);
    }

    uploadFile(fileName, ...args) {
            this.element.selectFile(`cypress/fixtures/${fileName}`, ...args);
    }

    getAttributeValue(attribute) {
        if (this.element) {
            return this
                .element
                .invoke('attr', attribute)
        }
    }

    wrap(...args) {
        this.element = cy.wrap(...args);
        return this;
    }

    filter(...args) {
       this.element = this.element.filter(...args);
        return this; 
    }

    getUserRoles() {
        return cy.getUserRoles();
    }

    getUserPermissions(...args) {
        this.element = cy.getUserPermissions(...args);
        return this;
    }

    then(...args) {
        this.element = this.element.then(...args);
        return this;
    }

    log(...args) {
        this.element = cy.log(...args);
        return this;
    }

    as(...args) {
        this.element = this.element.as(...args);
        return this;
    }

    trigger(...args) {
        this.element = this.element.trigger(...args);
        return this;
    }

    window(...args) {
        this.element = cy.window(...args);
        return this;
    }

    clearSessionData() {
        this.element = cy.clearSessionData();
        return this;
    }

    realHover(...args) {
        this.element = this.element.realHover(...args);
        return this;
    }

    parent(...args){
        this.element = this.element.parent(...args);
        return this;
    }

    invoke(...args){
        this.element = this.element.invoke(...args);
        return this;
    }

    once(...args){
        this.element = cy.once(...args);
        return this;
    }

    assignUserRole(email, role) {
        this.element = cy.assignUserRole(email, role);
        return this;
    }

    removeUserRole(email, role) {
        cy.removeUserRole(email, role);
    }

    removeAllUserRoles(...args) {
        cy.removeAllUserRoles(...args);
    }
}

const action = new Action
export default action;
