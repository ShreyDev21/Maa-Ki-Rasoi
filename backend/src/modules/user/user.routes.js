import { Router } from "express";
import {
    getProfile,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    getAllUsers,
    updateUserRole,
    toggleUserStatus,
} from "./user.controller.js";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Customer routes
router.get("/profile", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile);
router.post("/addresses", addAddress);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// Admin routes
router.get("/admin/all", authorizeRoles("admin"), getAllUsers);
router.put("/admin/:userId/role", authorizeRoles("admin"), updateUserRole);
router.put("/admin/:userId/status", authorizeRoles("admin"), toggleUserStatus);

export default router;
