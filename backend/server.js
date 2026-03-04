import dotenv from "dotenv";
dotenv.config();

import { app } from "./src/app.js";
import { connectDB } from "./src/config/index.js";
import { configureCloudinary } from "./src/config/cloudinary.js";

const PORT = process.env.PORT || 5000;

// ─── STARTUP ───────────────────────────────────────────────
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Configure Cloudinary
        configureCloudinary();

        // Start the server
        app.listen(PORT, () => {
            console.log(`\n🍲 Maa Ki Rasoi Server running on port ${PORT}`);
            console.log(`📍 Health: http://localhost:${PORT}/api/v1/health`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err.message);
    process.exit(1);
});
