import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Route imports
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";

// Middleware
import { errorHandler } from "./middleware/error.middleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();

// ─── GLOBAL MIDDLEWARE ─────────────────────────────────────
const allowedOrigins = [
    "https://maa-ki-rasoi-red.vercel.app",
    "http://localhost:5173"
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);
// app.use(
//     cors({
//         origin: process.env.CORS_ORIGIN,
//         credentials: true,
//     })
// );
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ─── HEALTH CHECK ──────────────────────────────────────────
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json(
        new ApiResponse(200, {
            status: "OK",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        }, "Maa Ki Rasoi API is running 🍲")
    );
});

// ─── API ROUTES ────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// ─── 404 HANDLER ───────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Route not found",
        data: null,
    });
});

// ─── GLOBAL ERROR HANDLER ──────────────────────────────────
app.use(errorHandler);

export { app };
