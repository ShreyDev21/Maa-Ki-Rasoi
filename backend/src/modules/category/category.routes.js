import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} from "./category.controller.js";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = Router();

// Public
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

// Admin only
router.post(
    "/",
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("image"),
    createCategory
);
router.put(
    "/:id",
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("image"),
    updateCategory
);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteCategory);

export default router;
