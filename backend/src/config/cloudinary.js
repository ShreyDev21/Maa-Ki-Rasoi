import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary SDK with credentials from environment variables
 */
const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("☁️  Cloudinary configured");
};

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadOnCloudinary = async (fileBuffer, folder = "maa-ki-rasoi") => {
    try {
        if (!fileBuffer) return null;

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(fileBuffer);
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
        };
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        return null;
    }
};

/**
 * Delete a file from Cloudinary by its public ID
 * @param {string} publicId - The Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Cloudinary deletion failed:", error.message);
        return null;
    }
};

export { configureCloudinary, uploadOnCloudinary, deleteFromCloudinary };
