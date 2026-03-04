import { Product } from "./product.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../../config/cloudinary.js";

// ─── CREATE PRODUCT (Admin) ────────────────────────────────
export const createProduct = asyncHandler(async (req, res) => {
    const {
        name, description, shortDescription, price, discountPrice,
        category, stock, unit, weight, ingredients, isVeg, isFeatured, tags,
    } = req.body;

    // Upload images
    const images = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploaded = await uploadOnCloudinary(
                file.buffer,
                "maa-ki-rasoi/products"
            );
            if (uploaded) {
                images.push({ url: uploaded.url, publicId: uploaded.publicId });
            }
        }
    }

    const product = await Product.create({
        name, description, shortDescription, price, discountPrice,
        category, stock, unit, weight, ingredients, isVeg, isFeatured,
        tags: tags ? (typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags) : [],
        images,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});

// ─── GET ALL PRODUCTS (with filters, search, pagination) ───
export const getAllProducts = asyncHandler(async (req, res) => {
    const {
        page = 1, limit = 12, search, category, minPrice, maxPrice,
        sort = "-createdAt", isVeg, isFeatured,
    } = req.query;

    const query = { isActive: true };

    if (search) {
        query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (isVeg !== undefined) query.isVeg = isVeg === "true";
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
        Product.find(query)
            .populate("category", "name slug")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit)),
        Product.countDocuments(query),
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        }, "Products fetched successfully")
    );
});

// ─── GET PRODUCT BY SLUG ───────────────────────────────────
export const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate("category", "name slug");

    if (!product) throw new ApiError(404, "Product not found");

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ─── GET PRODUCT BY ID ────────────────────────────────────
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate("category", "name slug");

    if (!product) throw new ApiError(404, "Product not found");

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ─── UPDATE PRODUCT (Admin) ────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    const updateFields = [
        "name", "description", "shortDescription", "price", "discountPrice",
        "category", "stock", "unit", "weight", "ingredients",
        "isVeg", "isFeatured", "isActive",
    ];

    updateFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            product[field] = req.body[field];
        }
    });

    if (req.body.tags) {
        product.tags =
            typeof req.body.tags === "string"
                ? req.body.tags.split(",").map((t) => t.trim())
                : req.body.tags;
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploaded = await uploadOnCloudinary(
                file.buffer,
                "maa-ki-rasoi/products"
            );
            if (uploaded) {
                product.images.push({ url: uploaded.url, publicId: uploaded.publicId });
            }
        }
    }

    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product updated successfully"));
});

// ─── DELETE PRODUCT IMAGE (Admin) ──────────────────────────
export const deleteProductImage = asyncHandler(async (req, res) => {
    const { id, imageId } = req.params;

    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    const image = product.images.id(imageId);
    if (!image) throw new ApiError(404, "Image not found");

    await deleteFromCloudinary(image.publicId);
    image.deleteOne();
    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Image deleted successfully"));
});

// ─── DELETE PRODUCT (Admin) ────────────────────────────────
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    // Delete all images from Cloudinary
    for (const img of product.images) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
    }

    await product.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

// ─── GET FEATURED PRODUCTS ─────────────────────────────────
export const getFeaturedProducts = asyncHandler(async (_req, res) => {
    const products = await Product.find({ isFeatured: true, isActive: true })
        .populate("category", "name slug")
        .limit(8)
        .sort("-createdAt");

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Featured products fetched"));
});

// ─── ADMIN: GET ALL PRODUCTS (including inactive) ──────────
export const adminGetAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search, category } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
        Product.find(query)
            .populate("category", "name slug")
            .sort("-createdAt")
            .skip(skip)
            .limit(Number(limit)),
        Product.countDocuments(query),
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        }, "Products fetched successfully")
    );
});
