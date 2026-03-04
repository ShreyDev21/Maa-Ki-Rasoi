import { Review } from "./review.model.js";
import { Product } from "../product/product.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

/**
 * Helper: Recalculate product rating averages
 */
const updateProductRatings = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: stats[0].avgRating,
            ratingsCount: stats[0].count,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsCount: 0,
        });
    }
};

// ─── CREATE/UPDATE REVIEW ──────────────────────────────────
export const createOrUpdateReview = asyncHandler(async (req, res) => {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    const review = await Review.findOneAndUpdate(
        { user: req.user._id, product: productId },
        { rating, title, comment },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    await updateProductRatings(product._id);

    return res
        .status(200)
        .json(new ApiResponse(200, review, "Review submitted successfully"));
});

// ─── GET REVIEWS FOR A PRODUCT ─────────────────────────────
export const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
        Review.find({ product: productId })
            .populate("user", "name avatar")
            .sort("-createdAt")
            .skip(skip)
            .limit(Number(limit)),
        Review.countDocuments({ product: productId }),
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        }, "Reviews fetched successfully")
    );
});

// ─── DELETE REVIEW ─────────────────────────────────────────
export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new ApiError(404, "Review not found");

    if (
        review.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        throw new ApiError(403, "Not authorized to delete this review");
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRatings(productId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review deleted successfully"));
});
