/// <reference types="Cypress" />

const tenantId = Cypress.env("tenantId");
const clientId = Cypress.env("clientId");
const clientSecret = Cypress.env("clientSecret");
const authority = Cypress.env("authBaseUrl") + "/" + Cypress.env("tenantId");
const graphBaseUrl = Cypress.env('graphBaseUrl');

const getAccessToken = () => {
    return cy.request({
        url: authority + "/oauth2/v2.0/token",
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


const getRoleIdFromRoleName = (accessToken, roleName) => {
    const roleDefinitionsEndpoint = `${graphBaseUrl}/rolemanagement/directory/roleDefinitions`;
    return cy.request({
        url: roleDefinitionsEndpoint,
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        qs: {
            $filter: `displayName eq '${roleName}'`
        }
    }).then((response) => {
        expect(response.body.value).to.have.lengthOf(1);
        return response.body.value[0].id;
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

const getRoleAssignmentId = (accessToken, roleId, userId) => {
    const roleAssignmentEndpoint = `${graphBaseUrl}/roleManagement/directory/roleAssignments/`;
    return cy.request({
        url: roleAssignmentEndpoint,
        method: "GET",
        qs: {
            $filter: `(principalId eq '${userId}' and roleDefinitionId eq '${roleId}')`
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response) => {
        expect(response.body.value).to.have.lengthOf(1);
        return response.body.value[0].id;
    })
}


const createUnifiedRoleAssignment = (accessToken, roleId, userId) => {
    const roleMembersEndpoint = `${graphBaseUrl}/roleManagement/directory/roleAssignments/`;
    return cy.request({
        url: roleMembersEndpoint,
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: {
            "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
            "principalId": userId,
            "roleDefinitionId": roleId,
            "directoryScopeId": "/"
        },
    }).then((response) => {
        if (response.status === 201) {
            cy.log(`Role successfully assigned to user with ID: ${userId}`);
        } else {
            cy.log("Failed to assign role:", response);
        }
    });
};

const deleteUnifiedRoleAssignment = (accessToken, roleAssignmentId) => {
    const deleteEndpoint = `${graphBaseUrl}/roleManagement/directory/roleAssignments/${roleAssignmentId}`;
    return cy.request({
        method: "DELETE",
        url: deleteEndpoint,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((response) => {
        if (response.status === 204) {
            cy.log(`Successfully deleted role assignment.`);
        } else {
            throw new Error("Failed to delete role assignment.");
        }
    });
};

export const assignRole = (username, roleName) => {
    getAccessToken().then((accessToken) => {

        getRoleIdFromRoleName(accessToken, roleName).then((roleId) => {
            if (!roleId) {
                throw new Error(`Role ${roleName} not found.`);
            }

            fetchUserId(accessToken, username).then((userId) => {
                createUnifiedRoleAssignment(accessToken, roleId, userId);
            });
        });
    });
};

export const removeRole = (username, roleName) => {
    getAccessToken().then((accessToken) => {
        getRoleIdFromRoleName(accessToken, roleName).then((roleId) => {
            fetchUserId(accessToken, username).then((userId) => {
                getRoleAssignmentId(accessToken, roleId, userId).then((roleAssignmentId) => {
                    deleteUnifiedRoleAssignment(accessToken, roleAssignmentId);
                })
            })
        })
    })
}
