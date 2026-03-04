import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to check express-validator validation results
 * Must be used after express-validator check/body/param/query middleware
 */
const validate = (req, _res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
        }));
        const firstError = extractedErrors[0]?.message || "Validation failed";

        throw new ApiError(422, firstError, extractedErrors);
    }

    next();
};

export { validate };
