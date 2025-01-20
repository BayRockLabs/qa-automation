/// <reference types="Cypress" />

import { decode } from 'jsonwebtoken';

const authority = Cypress.env("AUTH_BASE_URL") + "/" + Cypress.env("TENANT_ID");
const clientId = Cypress.env("CLIENT_ID");
const clientSecret = Cypress.env("CLIENT_SECRET");
const apiScopes = ["user.read", "openid", "profile", "email"];
const tenantId = Cypress.env("TENANT_ID");
const registerUrl = Cypress.env("REGISTER_URL");
const environment = "login.windows.net";
let username;
let password;

// Functions to build the required entities for authentication
const buildAccountEntity = (
	homeAccountId,
	clientInfo,
	idTokenClaims,
	realm,
	localAccountId,
	username,
	name
) => {
	return {
		authorityType: "MSSTS",
		clientInfo: clientInfo,
		idTokenClaims: idTokenClaims,
		homeAccountId: homeAccountId,
		environment: environment,
		realm: realm,
		localAccountId: localAccountId,
		username: username,
		name: name,
	};
};

const buildIdTokenEntity = (
	homeAccountId,
	idToken,
	realm
) => {
	return {
		credentialType: "IdToken",
		homeAccountId: homeAccountId,
		environment: environment,
		clientId: clientId,
		secret: idToken,
		realm: realm,
	};
};


const buildAccessTokenEntity = (
	homeAccountId,
	accessToken,
	expiresIn,
	extExpiresIn,
	realm,
	scopes
) => {
	const now = Math.floor(Date.now() / 1000);
	return {
		homeAccountId: homeAccountId,
		credentialType: "AccessToken",
		secret: accessToken,
		cachedAt: now.toString(),
		expiresOn: (now + expiresIn).toString(),
		extendedExpiresOn: (now + extExpiresIn).toString(),
		environment: environment,
		clientId: clientId,
		realm: realm,
		target: scopes,
		tokenType: "Bearer"
	};
};

const buildRefreshTokenEntity = (
	clientId,
	environment,
	homeAccountId,
	refreshToken
) => {
	return {
		clientId: clientId,
		credentialType: "RefreshToken",
		environment: environment,
		homeAccountId: homeAccountId,
		secret: refreshToken
	};
};

const buildUserDataEntity = (
	userInfo,
	userRoles
) => {
	return {
		user_info: userInfo,
		user_roles: userRoles
	};
};


// Function to inject the tokens into localStorage for testing
const injectTokens = (tokenResponse) => {
	const idToken = decode(tokenResponse.id_token);
	const accessToken = tokenResponse.access_token;
	const localAccountId = idToken.oid || idToken.sid;
	const realm = idToken.tid;
	const homeAccountId = `${localAccountId}.${realm}`
	const username = idToken.preferred_username;
	const name = idToken.name;
	const scope = tokenResponse.scope;

	const clientInfoJSON = {
		uid: idToken.oid,
		utid: tenantId,
	};

	// Encode the JSON object into base64
	const jsonString = JSON.stringify(clientInfoJSON);
	let base64String = btoa(jsonString);
	const clientInfo = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	const idTokenClaims = idToken;

	const accountKey = `${homeAccountId}-${environment}-${realm}`;
	const accountEntity = buildAccountEntity(
		homeAccountId,
		clientInfo,
		idTokenClaims,
		realm,
		localAccountId,
		username,
		name
	);

	const idTokenKey = `${homeAccountId}-${environment}-idtoken-${clientId}-${realm}-`;
	const idTokenEntity = buildIdTokenEntity(
		homeAccountId,
		tokenResponse.id_token,
		realm
	);

	const accessTokenKey = `${homeAccountId}-${environment}-accesstoken-${clientId}-${realm}-${apiScopes.join(" ")}`;
	const accessTokenEntity = buildAccessTokenEntity(
		homeAccountId,
		tokenResponse.access_token,
		tokenResponse.expires_in,
		tokenResponse.ext_expires_in,
		realm,
		scope
	);

	const refreshTokenKey = `${homeAccountId}-${environment}-refreshtoken-${clientId}--`;
	const refreshTokenEntity = buildRefreshTokenEntity(
		clientId,
		environment,
		homeAccountId,
		tokenResponse.refresh_token
	);

	const microsoftCodeKey = 'microsoft_code';
	const microsoftCodeValue = accessToken;

	userData(accessToken).then((response) => {
		const userDataKey = 'userData';
		const userDataEntity = buildUserDataEntity(response.user_info, response.user_roles);
		localStorage.setItem(userDataKey, JSON.stringify(userDataEntity));
	});

	sessionStorage.setItem(accountKey, JSON.stringify(accountEntity));
	sessionStorage.setItem(idTokenKey, JSON.stringify(idTokenEntity));
	sessionStorage.setItem(accessTokenKey, JSON.stringify(accessTokenEntity));
	sessionStorage.setItem(refreshTokenKey, JSON.stringify(refreshTokenEntity));
	localStorage.setItem(microsoftCodeKey, microsoftCodeValue);
};


export const login = (user) => {
	cy.logout();
	username = user.email;
	password = user.password;
		return cy.visit("/login").request({
			url: authority + "/oauth2/v2.0/token",
			method: "POST",
			body: {
				grant_type: "password",
				client_id: clientId,
				client_secret: clientSecret,
				username: username,
				password: password,
				scope: "user.read openid profile offline_access",
			},
			form: true
		}).then((response) => {
			injectTokens(response.body);
			return cy.window().its('localStorage').then((localStorage) => {
                const userData = JSON.parse(localStorage.getItem('userData'));
                return userData.user_roles;
            });
		});
};

export const userData = (accessToken) => {
	return cy.request({
		url: registerUrl,
		method: "POST",
		body: {
			auth_token: accessToken,
		},
		form: true
	}).then((response) => {
		return {
			user_info: response.body.user_info,
			user_roles: response.body.user_roles
		}
	});
};

export const logout = () => {
	sessionStorage.clear();
	localStorage.clear();
}