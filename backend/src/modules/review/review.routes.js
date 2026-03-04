import { Router } from "express";
import {
    createOrUpdateReview,
    getProductReviews,
    deleteReview,
} from "./review.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/product/:productId", getProductReviews);
router.post("/", verifyJWT, createOrUpdateReview);
router.delete("/:id", verifyJWT, deleteReview);

export default router;
