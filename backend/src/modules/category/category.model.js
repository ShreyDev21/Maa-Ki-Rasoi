import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            maxlength: [50, "Category name must not exceed 50 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
            maxlength: [200, "Description must not exceed 200 characters"],
        },
        image: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Auto-generate slug from name
categorySchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
});

export const Category = mongoose.model("Category", categorySchema);
