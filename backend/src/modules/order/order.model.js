import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderNumber: {
            type: String,
            unique: true,
        },
        items: [orderItemSchema],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String, default: "" },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        paymentInfo: {
            method: {
                type: String,
                enum: ["razorpay", "cod"],
                default: "razorpay",
            },
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String,
            isPaid: { type: Boolean, default: false },
            paidAt: Date,
        },
        itemsTotal: { type: Number, required: true },
        shippingCharge: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },
        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "out_for_delivery",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "pending",
        },
        deliveryInfo: {
            estimatedDelivery: Date,
            deliveredAt: Date,
            trackingId: String,
            carrier: String,
        },
        statusHistory: [
            {
                status: String,
                timestamp: { type: Date, default: Date.now },
                note: { type: String, default: "" },
            },
        ],
        notes: { type: String, default: "" },
        cancelReason: { type: String, default: "" },
    },
    { timestamps: true }
);

// Auto-generate order number
orderSchema.pre("save", function () {
    if (!this.orderNumber) {
        const prefix = "MKR";
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.orderNumber = `${prefix}-${timestamp}-${random}`;
    }
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);
