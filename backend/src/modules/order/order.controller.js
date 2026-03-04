import { Order } from "./order.model.js";
import { Cart } from "../cart/cart.model.js";
import { Product } from "../product/product.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

// ─── CREATE ORDER ──────────────────────────────────────────
export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod = "razorpay", notes } = req.body;

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product"
    );

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // Validate stock and build order items
    const orderItems = [];
    for (const item of cart.items) {
        const product = item.product;

        if (!product || !product.isActive) {
            throw new ApiError(400, `Product "${product?.name || 'Unknown'}" is no longer available`);
        }
        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `Insufficient stock for "${product.name}". Available: ${product.stock}`
            );
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images?.[0]?.url || "",
            price: item.price,
            quantity: item.quantity,
        });
    }

    const itemsTotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Shipping charge: free above ₹500
    const shippingCharge = itemsTotal >= 500 ? 0 : 50;
    const tax = 0;
    const totalAmount = itemsTotal + shippingCharge + tax;

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentInfo: { method: paymentMethod },
        itemsTotal,
        shippingCharge,
        tax,
        totalAmount,
        notes,
        statusHistory: [{ status: "pending", note: "Order placed" }],
        deliveryInfo: {
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        },
    });

    // Decrease stock
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity, totalSold: item.quantity },
        });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order created successfully"));
});

// ─── GET MY ORDERS ─────────────────────────────────────────
export const getMyOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find({ user: req.user._id })
            .sort("-createdAt")
            .skip(skip)
            .limit(Number(limit)),
        Order.countDocuments({ user: req.user._id }),
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        }, "Orders fetched successfully")
    );
});

// ─── GET ORDER BY ID ───────────────────────────────────────
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) throw new ApiError(404, "Order not found");

    // Ensure user can only view their own orders (unless admin)
    if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        throw new ApiError(403, "You are not authorized to view this order");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// ─── CANCEL ORDER ──────────────────────────────────────────
export const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
        throw new ApiError(400, "Order cannot be cancelled at this stage");
    }

    order.orderStatus = "cancelled";
    order.cancelReason = req.body.reason || "Cancelled by customer";
    order.statusHistory.push({
        status: "cancelled",
        note: order.cancelReason,
    });

    // Restore stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity, totalSold: -item.quantity },
        });
    }

    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

// ─── ADMIN: GET ALL ORDERS ─────────────────────────────────
export const adminGetAllOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (search) query.orderNumber = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find(query)
            .populate("user", "name email")
            .sort("-createdAt")
            .skip(skip)
            .limit(Number(limit)),
        Order.countDocuments(query),
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        }, "Orders fetched successfully")
    );
});

// ─── ADMIN: UPDATE ORDER STATUS ────────────────────────────
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, note, trackingId, carrier } = req.body;

    const validStatuses = [
        "pending", "confirmed", "processing", "shipped",
        "out_for_delivery", "delivered", "cancelled", "returned",
    ];

    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    order.orderStatus = status;
    order.statusHistory.push({
        status,
        note: note || `Status updated to ${status}`,
    });

    if (status === "shipped" && trackingId) {
        order.deliveryInfo.trackingId = trackingId;
        order.deliveryInfo.carrier = carrier || "";
    }

    if (status === "delivered") {
        order.deliveryInfo.deliveredAt = new Date();
        // Auto-mark COD orders as paid on delivery
        if (order.paymentInfo.method === "cod" && !order.paymentInfo.isPaid) {
            order.paymentInfo.isPaid = true;
            order.paymentInfo.paidAt = new Date();
        }
    }

    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order status updated"));
});

// ─── ADMIN: MARK PAYMENT AS RECEIVED ──────────────────────
export const markPaymentReceived = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.paymentInfo.isPaid) {
        throw new ApiError(400, "Payment is already marked as paid");
    }

    order.paymentInfo.isPaid = true;
    order.paymentInfo.paidAt = new Date();
    order.statusHistory.push({
        status: order.orderStatus,
        note: "Payment marked as received by admin",
    });

    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Payment marked as received"));
});

// ─── ADMIN: GET ORDER STATS ────────────────────────────────
export const getOrderStats = asyncHandler(async (_req, res) => {
    const stats = await Order.aggregate([
        {
            $group: {
                _id: "$orderStatus",
                count: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
        { $match: { "paymentInfo.isPaid": true } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            statusBreakdown: stats,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
        }, "Order stats fetched")
    );
});
