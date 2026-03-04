import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../user/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";
import { sendEmail, generateOTP, otpEmailTemplate } from "../../utils/email.js";

/**
 * Helper: Generate access + refresh tokens for a user and save refresh token to DB
 */
const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId).select("+refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

/**
 * Cookie options for tokens
 */
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Helper: Send OTP to user's email
 */
const sendOtpToUser = async (user) => {
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        to: user.email,
        subject: "Verify Your Email — Maa Ki Rasoi 🍲",
        html: otpEmailTemplate(user.name, otp),
    });
};

// ─── REGISTER ──────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // If exists but not verified, resend OTP
        if (!existingUser.isEmailVerified) {
            await sendOtpToUser(existingUser);
            return res.status(200).json(
                new ApiResponse(200, { email: existingUser.email },
                    "Account exists but unverified. New OTP sent to your email.")
            );
        }
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({ name, email, password, phone });

    // Send OTP email
    await sendOtpToUser(user);

    return res.status(201).json(
        new ApiResponse(201, { email: user.email },
            "Registration successful! Please verify your email with the OTP sent.")
    );
});

// ─── VERIFY OTP ────────────────────────────────────────────
export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) throw new ApiError(404, "User not found");

    if (user.isEmailVerified) {
        throw new ApiError(400, "Email is already verified");
    }

    if (!user.otp || !user.otpExpiry) {
        throw new ApiError(400, "No OTP found. Please request a new one.");
    }

    if (new Date() > user.otpExpiry) {
        throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
        throw new ApiError(400, "Invalid OTP");
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Email verified successfully! You can now login.")
    );
});

// ─── RESEND OTP ────────────────────────────────────────────
export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    if (user.isEmailVerified) {
        throw new ApiError(400, "Email is already verified");
    }

    await sendOtpToUser(user);

    return res.status(200).json(
        new ApiResponse(200, {}, "New OTP sent to your email")
    );
});

// ─── LOGIN ─────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
        throw new ApiError(403, "Your account has been deactivated");
    }

    // Check email verification
    if (!user.isEmailVerified) {
        throw new ApiError(403, "Please verify your email first. Check your inbox for the OTP.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id);

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken },
                "Logged in successfully"
            )
        );
});

// ─── LOGOUT ────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
    });

    return res
        .status(200)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── REFRESH ACCESS TOKEN ──────────────────────────────────
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    let decoded;
    try {
        decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id).select("+refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token has been revoked");
    }

    const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Access token refreshed successfully"
            )
        );
});

// ─── CHANGE PASSWORD ───────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ─── GET CURRENT USER ──────────────────────────────────────
export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"));
});
