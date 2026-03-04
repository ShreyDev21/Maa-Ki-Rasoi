import multer from "multer";

/**
 * Multer configuration using memory storage
 * Files are stored in memory as Buffer objects for direct upload to Cloudinary
 * This avoids writing temp files to disk
 */
const storage = multer.memoryStorage();

/**
 * File filter — only allow images
 */
const fileFilter = (_req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max
    },
});

export { upload };
