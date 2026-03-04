import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductBySlug,
    getProductById,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    getFeaturedProducts,
    adminGetAllProducts,
} from "./product.controller.js";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = Router();

// Public
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin only
router.post(
    "/",
    verifyJWT,
    authorizeRoles("admin"),
    upload.array("images", 5),
    createProduct
);
router.put(
    "/:id",
    verifyJWT,
    authorizeRoles("admin"),
    upload.array("images", 5),
    updateProduct
);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteProduct);
router.delete(
    "/:id/images/:imageId",
    verifyJWT,
    authorizeRoles("admin"),
    deleteProductImage
);
router.get(
    "/admin/all",
    verifyJWT,
    authorizeRoles("admin"),
    adminGetAllProducts
);

export default router;
