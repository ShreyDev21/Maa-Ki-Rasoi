import { User } from "./user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../../config/cloudinary.js";

// ─── GET USER PROFILE ──────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

// ─── UPDATE USER PROFILE ───────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // Handle avatar upload
    if (req.file) {
        // Delete old avatar if exists
        if (req.user.avatar?.publicId) {
            await deleteFromCloudinary(req.user.avatar.publicId);
        }

        const uploaded = await uploadOnCloudinary(
            req.file.buffer,
            "maa-ki-rasoi/avatars"
        );
        if (uploaded) {
            updateData.avatar = { url: uploaded.url, publicId: uploaded.publicId };
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile updated successfully"));
});

// ─── ADD ADDRESS ───────────────────────────────────────────
export const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } =
        req.body;

    // If this is set as default, unset others
    if (isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // If first address, make it default
    const makeDefault = user.addresses.length === 0 ? true : isDefault || false;

    user.addresses.push({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault: makeDefault,
    });

    await user.save();

    return res
        .status(201)
        .json(new ApiResponse(201, user.addresses, "Address added successfully"));
});

// ─── UPDATE ADDRESS ────────────────────────────────────────
export const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);
    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } =
        req.body;

    if (isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(addressLine1 && { addressLine1 }),
        ...(addressLine2 !== undefined && { addressLine2 }),
        ...(city && { city }),
        ...(state && { state }),
        ...(pincode && { pincode }),
        ...(isDefault !== undefined && { isDefault }),
    });

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Address updated successfully"));
});

// ─── DELETE ADDRESS ────────────────────────────────────────
export const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    address.deleteOne();
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Address deleted successfully"));
});

// ─── ADMIN: GET ALL USERS ──────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const query = search
        ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        }
        : {};

    const [users, total] = await Promise.all([
        User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(query),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
            "Users fetched successfully"
        )
    );
});

// ─── ADMIN: UPDATE USER ROLE ───────────────────────────────
export const updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["customer", "admin"].includes(role)) {
        throw new ApiError(400, "Invalid role. Must be 'customer' or 'admin'");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    );

    if (!user) throw new ApiError(404, "User not found");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User role updated successfully"));
});

// ─── ADMIN: TOGGLE USER STATUS ─────────────────────────────
export const toggleUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                `User ${user.isActive ? "activated" : "deactivated"} successfully`
            )
        );
});
