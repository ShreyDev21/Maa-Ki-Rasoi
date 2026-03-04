import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to verify JWT access token
 * Extracts token from Authorization header or cookies
 * Attaches user object to req.user
 */
export const verifyJWT = asyncHandler(async (req, _res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized — Access token required");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Unauthorized — Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

/**
 * Role-based authorization middleware factory
 * @param  {...string} roles - Allowed roles (e.g., "admin", "customer")
 * @returns {Function} Express middleware
 */
export const authorizeRoles = (...roles) => {
    return (req, _res, next) => {
        if (!roles.includes(req.user?.role)) {
            throw new ApiError(
                403,
                `Forbidden — Role '${req.user?.role}' is not authorized to access this resource`
            );
        }
        next();
    };
};
