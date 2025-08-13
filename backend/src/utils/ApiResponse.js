// src/utils/ApiResponse.js

class ApiResponse {
    /**
     * @param {number} statusCode - The HTTP status code for the response.
     * @param {object} data - The data payload to be sent.
     * @param {string} message - A descriptive message for the response.
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        // The operation is successful if the status code is in the 2xx range.
        this.success = statusCode < 400; 
    }
}

export { ApiResponse };