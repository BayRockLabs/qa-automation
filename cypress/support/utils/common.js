/**
 * Removes all special charactes and trailing zeros from a given string.
 */
export const removeSpecialCharacters = (input) => {
    // return input.replace(/[^a-zA-Z0-9.]|\.(?=0+$)/g, '');
    if(typeof input != 'string'){
        throw new TypeError('Amount entered must be a string');
    }

    return input.replace(/[$,]/g, '').split('.')[0];
};

/**
 * Converts a hexadecimal color code to RGB format.
 * @param {*} hex 
 * @returns 
 */
export const hexToRGB = (hex) => {
    if (hex.charAt(0) === '#') {
        hex = hex.substr(1);
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
}

export const adjustUserRolesAccordingToEnvironment = (userRoles) => {
    const stringToAppend = Cypress.env('ENVIRONMENT') === 'demo' ? '_demo' : '';
    return (userRoles + stringToAppend);
}

export const arrayBufferToJSON = (buffer) => {
    const decoder = new TextDecoder('utf-8');
    const decodedString = decoder.decode(buffer);
    const decodedResponse = JSON.parse(decodedString);
    return decodedResponse;
}