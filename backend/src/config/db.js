import mongoose from "mongoose";

/**
 * Connect to MongoDB using Mongoose
 * Implements connection event listeners for production-grade monitoring
 */
const connectDB = async () => {
    try {
        // Build URI at runtime so the password is properly URL-encoded
        const user = encodeURIComponent(process.env.MONGODB_USER);
        const pass = encodeURIComponent(process.env.MONGODB_PASS);
        const host = process.env.MONGODB_HOST;
        const db = process.env.MONGODB_DB;

        const uri =
            process.env.MONGODB_URI ||
            `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;

        const connectionInstance = await mongoose.connect(uri);

        console.log(
            `\n✅ MongoDB Connected! Host: ${connectionInstance.connection.host}`
        );

        // Connection event listeners
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected. Attempting to reconnect...");
        });
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
