import { Cart } from "./cart.model.js";
import { Product } from "../product/product.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

// ─── GET CART ──────────────────────────────────────────────
export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
        "name slug price discountPrice images stock unit"
    );

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// ─── ADD TO CART ───────────────────────────────────────────
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (!product.isActive) throw new ApiError(400, "Product is not available");
    if (product.stock < quantity) {
        throw new ApiError(400, `Only ${product.stock} items available in stock`);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );

    const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = effectivePrice;
    } else {
        cart.items.push({
            product: productId,
            quantity,
            price: effectivePrice,
        });
    }

    await cart.save();

    cart = await Cart.findById(cart._id).populate(
        "items.product",
        "name slug price discountPrice images stock unit"
    );

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Item added to cart"));
});

// ─── UPDATE CART ITEM QUANTITY ──────────────────────────────
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) throw new ApiError(400, "Quantity must be at least 1");

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity) {
        throw new ApiError(400, `Only ${product.stock} items available in stock`);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = cart.items.find(
        (item) => item.product.toString() === productId
    );

    if (!item) throw new ApiError(404, "Item not found in cart");

    item.quantity = quantity;
    item.price = product.discountPrice > 0 ? product.discountPrice : product.price;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
        "items.product",
        "name slug price discountPrice images stock unit"
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCart, "Cart updated"));
});

// ─── REMOVE FROM CART ──────────────────────────────────────
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
        "items.product",
        "name slug price discountPrice images stock unit"
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCart, "Item removed from cart"));
});

// ─── CLEAR CART ────────────────────────────────────────────
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = [];
    await cart.save();

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart cleared"));
});
