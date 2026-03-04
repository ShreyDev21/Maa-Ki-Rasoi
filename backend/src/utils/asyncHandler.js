/**
 * Higher-order function that wraps async route handlers
 * Catches any rejected promises and passes errors to Express error handler
 * Eliminates the need for try-catch blocks in every controller
 *
 * @param {Function} requestHandler - Async Express route handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };
