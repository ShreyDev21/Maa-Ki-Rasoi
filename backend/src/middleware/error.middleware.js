import { ApiError } from "../utils/ApiError.js";

/**
 * Global error handling middleware
 * Catches all errors thrown in the app and returns a consistent JSON response
 *
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, _next) => {
    let error = err;

    // If error is not an instance of ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error.status || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    // Handle specific Mongoose errors
    if (err.name === "CastError") {
        error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue);
        error = new ApiError(
            409,
            `Duplicate value for field: ${field}. Please use another value.`
        );
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
        error = new ApiError(400, `Validation Error: ${messages.join(", ")}`);
    }

    if (err.name === "JsonWebTokenError") {
        error = new ApiError(401, "Invalid token. Please log in again.");
    }

    if (err.name === "TokenExpiredError") {
        error = new ApiError(401, "Token expired. Please log in again.");
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    };

    console.error(`❌ [${error.statusCode}] ${error.message}`);

    return res.status(error.statusCode).json(response);
};

export { errorHandler };
