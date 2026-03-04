import crypto from "crypto";
import { Order } from "../order/order.model.js";
import { razorpayInstance } from "../../config/index.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

// ─── CREATE RAZORPAY ORDER ─────────────────────────────────
export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }
    if (order.paymentInfo.isPaid) {
        throw new ApiError(400, "Order is already paid");
    }

    const razorpayOrder = await razorpayInstance().orders.create({
        amount: Math.round(order.totalAmount * 100), // Razorpay expects paise
        currency: "INR",
        receipt: order.orderNumber,
        notes: {
            orderId: order._id.toString(),
            userId: req.user._id.toString(),
        },
    });

    order.paymentInfo.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json(
        new ApiResponse(200, {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        }, "Razorpay order created")
    );
});

// ─── VERIFY RAZORPAY PAYMENT ───────────────────────────────
export const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed — Invalid signature");
    }

    // Update order
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
    order.paymentInfo.razorpaySignature = razorpay_signature;
    order.paymentInfo.isPaid = true;
    order.paymentInfo.paidAt = new Date();
    order.orderStatus = "confirmed";
    order.statusHistory.push({
        status: "confirmed",
        note: "Payment received successfully",
    });

    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Payment verified successfully"));
});

// ─── GET RAZORPAY KEY (public) ─────────────────────────────
export const getRazorpayKey = asyncHandler(async (_req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {
            keyId: process.env.RAZORPAY_KEY_ID,
        }, "Razorpay key fetched")
    );
});
