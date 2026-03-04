import { Category } from "./category.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../../config/cloudinary.js";

// ─── CREATE CATEGORY (Admin) ───────────────────────────────
export const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
        throw new ApiError(409, "Category already exists");
    }

    let image = {};
    if (req.file) {
        const uploaded = await uploadOnCloudinary(
            req.file.buffer,
            "maa-ki-rasoi/categories"
        );
        if (uploaded) image = { url: uploaded.url, publicId: uploaded.publicId };
    }

    const category = await Category.create({ name, description, image });

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});

// ─── GET ALL CATEGORIES ────────────────────────────────────
export const getAllCategories = asyncHandler(async (_req, res) => {
    const categories = await Category.find({ isActive: true }).sort({
        name: 1,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, categories, "Categories fetched successfully")
        );
});

// ─── GET CATEGORY BY SLUG ──────────────────────────────────
export const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw new ApiError(404, "Category not found");

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category fetched successfully"));
});

// ─── UPDATE CATEGORY (Admin) ───────────────────────────────
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    const { name, description, isActive } = req.body;

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    if (req.file) {
        if (category.image?.publicId) {
            await deleteFromCloudinary(category.image.publicId);
        }
        const uploaded = await uploadOnCloudinary(
            req.file.buffer,
            "maa-ki-rasoi/categories"
        );
        if (uploaded) {
            category.image = { url: uploaded.url, publicId: uploaded.publicId };
        }
    }

    await category.save();

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
});

// ─── DELETE CATEGORY (Admin) ───────────────────────────────
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    if (category.image?.publicId) {
        await deleteFromCloudinary(category.image.publicId);
    }

    await category.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"));
});
