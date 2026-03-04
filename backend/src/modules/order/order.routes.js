import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    adminGetAllOrders,
    updateOrderStatus,
    getOrderStats,
} from "./order.controller.js";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Customer
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

// Admin
router.get("/admin/all", authorizeRoles("admin"), adminGetAllOrders);
router.get("/admin/stats", authorizeRoles("admin"), getOrderStats);
router.put("/admin/:id/status", authorizeRoles("admin"), updateOrderStatus);

export default router;
