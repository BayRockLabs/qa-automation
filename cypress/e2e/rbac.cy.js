import { Action } from '../support/actions/action';
import { ClientManagement } from '../support/pages/client_management';
import { Common } from '../support/pages/common';

const action = new Action();
const rbac = new Common();
const users = Cypress.env('users');

users.forEach(user => {
    describe("Role based access testing for " + user.email, () => {
        beforeEach(() => {
            action.clearAllCookies();
            action.clearAllLocalStorage();
            action.clearAllSessionStorage();
            action.login(user);
            action.window().then((window) => {
                const userData = JSON.parse(window.localStorage.getItem('userData'));
                const userRoles = userData.user_roles;
                action.getUserRoles(userRoles).then(permissions => {
                    action.wrap(permissions).as('userPermissions');
                }); 
            });
            action.get('@userPermissions').should('exist');
            rbac.visitDashboard();
        });

        it("Verifies client management view permission", () => {
            action.url().should('contain', '/dashboard');
        });

        it("Verifies client management admin permissions", () => {
            
        });
    });
});