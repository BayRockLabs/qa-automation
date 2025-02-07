/// <reference types="Cypress" />

const tenantId = Cypress.env("TENANT_ID");
const clientId = Cypress.env("CLIENT_ID");
const clientSecret = Cypress.env("CLIENT_SECRET");
const authority = Cypress.env("AUTH_BASE_URL") + "/" + Cypress.env("TENANT_ID");
const graphBaseUrl = Cypress.env("GRAPH_BASE_URL");

const getAccessToken = () => {
  return cy
    .request({
      url: authority + "/oauth2/v2.0/token",
      method: "POST",
      form: true,
      body: {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.body.access_token;
      } else {
        throw new Error("Failed to fetch access token.");
      }
    });
};

const getRoleIdFromRoleName = (accessToken, roleName) => {
  const roleDefinitionsEndpoint = `${graphBaseUrl}/rolemanagement/directory/roleDefinitions`;
  return cy
    .request({
      url: roleDefinitionsEndpoint,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      qs: {
        $filter: `displayName eq '${roleName}'`,
      },
    })
    .then((response) => {
      expect(response.body.value).to.have.lengthOf(1);
      return response.body.value[0].id;
    });
};

const getUserId = (accessToken, username) => {
  const userEndpoint = `${graphBaseUrl}/users/${username}`;
  return cy
    .request({
      url: userEndpoint,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      return response.body.id;
    });
};

const getRoleAssignmentId = (accessToken, roleId, userId) => {
  const roleAssignmentEndpoint = `${graphBaseUrl}/roleManagement/directory/roleAssignments/`;
  return cy
    .request({
      url: roleAssignmentEndpoint,
      method: "GET",
      qs: {
        $filter: `(principalId eq '${userId}' and roleDefinitionId eq '${roleId}')`,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      return response.body.value[0].id;
    });
};

const createUnifiedRoleAssignment = (accessToken, roleId, userId) => {
  const roleMembersEndpoint = `${graphBaseUrl}/roleManagement/directory/roleAssignments/`;
  return cy
    .request({
      url: roleMembersEndpoint,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: {
        "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
        principalId: userId,
        roleDefinitionId: roleId,
        directoryScopeId: "/",
      },
    })
    .then((response) => {
      expect(response.status).to.equal(201);
    });
};

const deleteUnifiedRoleAssignment = (accessToken, roleAssignmentId) => {
  const deleteEndpoint = `${graphBaseUrl}/roleManagement/directory/roleAssignments/${roleAssignmentId}`;
  return cy
    .request({
      method: "DELETE",
      url: deleteEndpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      expect(response.status).to.equal(204);
    });
};

export const assignRole = (username, roleName) => {
  getAccessToken().then((accessToken) => {
    getRoleIdFromRoleName(accessToken, roleName).then((roleId) => {
      if (!roleId) {
        throw new Error(`Role ${roleName} not found.`);
      }

      getUserId(accessToken, username).then((userId) => {
        createUnifiedRoleAssignment(accessToken, roleId, userId);
      });
    });
  });
};

export const removeRole = (username, roleName) => {
  getAccessToken().then((accessToken) => {
    getRoleIdFromRoleName(accessToken, roleName).then((roleId) => {
      if (!roleId) {
        throw new Error(`Role ${roleName} not found.`);
      }

      getUserId(accessToken, username).then((userId) => {
        getRoleAssignmentId(accessToken, roleId, userId).then(
          (roleAssignmentId) => {
            deleteUnifiedRoleAssignment(accessToken, roleAssignmentId);
          },
        );
      });
    });
  });
};

const getAllRoleAssignments = (accessToken, userId) => {
  const roleAssignmentEndpoint = `${graphBaseUrl}/roleManagement/directory/roleAssignments/`;
  return cy
    .request({
      url: roleAssignmentEndpoint,
      method: "GET",
      qs: {
        $filter: `(principalId eq '${userId}')`,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      return response.body.value;
    });
};

export const removeAllUserRoles = (username) => {
  getAccessToken().then((accessToken) => {
    getUserId(accessToken, username).then((userId) => {
      getAllRoleAssignments(accessToken, userId).then((roleAssignments) => {
        roleAssignments.forEach((roleAssignment) => {
          deleteUnifiedRoleAssignment(accessToken, roleAssignment.id);
        });
      });
    });
  });
};

export const waitForRoleUpdate = (
  expectedRoles,
  removal = false,
  timeout = 50000,
  interval = 7000,
) => {
  const startTime = Date.now();
  const userCredentials = Cypress.env("USER");

  const checkRoles = () => {
    return cy.login(userCredentials).then((userRoles) => {
      if (!removal && userRoles.includes(expectedRoles)) {
        return true;
      } else if (removal && userRoles.length === 0) {
        return true;
      }
      if (Date.now() - startTime > timeout) {
        throw new Error("Roles did not update in time");
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(checkRoles()), interval);
      });
    });
  };
  return checkRoles();
};
