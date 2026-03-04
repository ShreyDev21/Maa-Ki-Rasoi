import { Router } from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "./cart.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/item/:productId", updateCartItem);
router.delete("/item/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
