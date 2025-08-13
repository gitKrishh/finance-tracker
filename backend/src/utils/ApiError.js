// src/utils/ApiError.js

class ApiError extends Error {
    /**
     * @param {number} statusCode - The HTTP status code for the error.
     * @param {string} message - A descriptive error message.
     * @param {Array} errors - An array of specific validation errors (optional).
     * @param {string} stack - The error stack trace (optional).
     */
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null; // This field is null for errors.
        this.message = message;
        this.success = false; // Indicates the operation failed.
        this.errors = errors;

        // Capture stack trace if provided, otherwise generate a new one.
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };