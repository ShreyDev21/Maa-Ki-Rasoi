import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [100, "Product name must not exceed 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            maxlength: [2000, "Description must not exceed 2000 characters"],
        },
        shortDescription: {
            type: String,
            maxlength: [200, "Short description must not exceed 200 characters"],
            default: "",
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        discountPrice: {
            type: Number,
            default: 0,
            min: [0, "Discount price cannot be negative"],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
            },
        ],
        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        unit: {
            type: String,
            enum: ["kg", "g", "ml", "l", "pcs", "pack", "bottle", "jar"],
            default: "pcs",
        },
        weight: {
            type: String,
            default: "",
        },
        ingredients: {
            type: String,
            default: "",
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsCount: {
            type: Number,
            default: 0,
        },
        totalSold: {
            type: Number,
            default: 0,
        },
        tags: [{ type: String, trim: true }],
    },
    { timestamps: true }
);

// Auto-generate slug
productSchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            + "-" + Date.now().toString(36);
    }
});

// Index for search and filtering
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

export const Product = mongoose.model("Product", productSchema);
