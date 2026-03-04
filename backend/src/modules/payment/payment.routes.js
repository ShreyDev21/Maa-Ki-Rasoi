import { Router } from "express";
import {
    createRazorpayOrder,
    verifyPayment,
    getRazorpayKey,
} from "./payment.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/razorpay-key", getRazorpayKey);
router.post("/create-order", verifyJWT, createRazorpayOrder);
router.post("/verify", verifyJWT, verifyPayment);

export default router;
