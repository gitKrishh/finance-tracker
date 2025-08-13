// src/utils/asyncHandler.js

/**
 * @description A utility function to wrap async route handlers and catch errors.
 * @param {Function} requestHandler - The async function to execute (e.g., a controller).
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };