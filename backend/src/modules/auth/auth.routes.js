import { Router } from "express";
import {
    register,
    login,
    logout,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    verifyOTP,
    resendOTP,
} from "./auth.controller.js";
import {
    registerValidator,
    loginValidator,
    changePasswordValidator,
} from "./auth.validators.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerValidator, validate, register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginValidator, validate, login);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logout);
router.put(
    "/change-password",
    verifyJWT,
    changePasswordValidator,
    validate,
    changePassword
);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
