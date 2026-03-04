/**
 * Generic API Response class for consistent success responses
 * All successful API responses should use this class
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {any} data - Response payload
     * @param {string} message - Success message
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export { ApiResponse };
