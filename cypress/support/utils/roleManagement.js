/// <reference types="Cypress" />

const tenantId = Cypress.env("tenantId");
const clientId = Cypress.env("clientId");
const clientSecret = Cypress.env("clientSecret");
const authority = `${Cypress.env('authBaseUrl')}/${tenantId}}/oauth2/v2.0/token`;
const graphBaseUrl = Cypress.env('graphBaseUrl');

const getAccessToken = () => {
    return cy.request({
        url: authority,
        method: "POST",
        form: true,
        body: {
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            scope: "https://graph.microsoft.com/.default",
        },
    }).then((response) => {
        if (response.status === 200) {
            return response.body.access_token;
        } else {
            throw new Error("Failed to fetch access token.");
        }
    });
};


const fetchRoles = (accessToken) => {
    const rolesEndpoint = `${graphBaseUrl}/directoryRoles`;

    return cy.request({
        url: rolesEndpoint,
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((response) => {
        return response.body.value; // returns a list of roles
    });
};

const fetchUserId = (accessToken, username) => {
    const userEndpoint = `${graphBaseUrl}/users/${username}`;

    return cy.request({
        url: userEndpoint,
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((response) => {
        return response.body.id;
    });
};


const assignRoleToUser = (accessToken, roleId, userId) => {
    const roleMembersEndpoint = `${graphBaseUrl}/directoryRoles/${roleId}/members/$ref`;

    return cy.request({
        url: roleMembersEndpoint,
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: {
            "@odata.id": `${graphBaseUrl}/users/${userId}`,
        },
    }).then((response) => {
        if (response.status === 204) {
            cy.log(`Role successfully assigned to user with ID: ${userId}`);
        } else {
            cy.log("Failed to assign role:", response);
        }
    });
};

const deleteRoleFromUser = (accessToken, roleId, userId) => {
    const deleteEndpoint = `${graphBaseUrl}/directoryRoles/${roleId}/members/${userId}/$ref`;

    return cy.request({
        method: "DELETE",
        url: deleteEndpoint,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((response) => {
        if (response.status === 204) {
            cy.log(`Successfully deleted role assignment for user: ${userId}`);
        } else {
            throw new Error("Failed to delete role assignment.");
        }
    });
};

export const assignRole = (username, roleName) => {
    getAccessToken().then((accessToken) => {

        fetchRoles(accessToken).then((roles) => {
            const role = roles.find((r) => r.displayName === roleName);
            if (!role) {
                throw new Error(`Role ${roleName} not found.`);
            }

            fetchUserId(accessToken, username).then((userId) => {
                assignRoleToUser(accessToken, role.id, userId);
            });
        });
    });
};

export const removeRole = (username, roleName) => {
    getAccessToken().then((accessToken) => {
        getRoleId(accessToken, roleName).then((roleId) => {
            const userEndpoint = `${graphBaseUrl}/users/${username}`;
            cy.request({
                method: "GET",
                url: userEndpoint,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((userResponse) => {
                const userId = userResponse.body.id;
                deleteRoleFromUser(accessToken, roleId, userId);
            });
        });
    });
};
