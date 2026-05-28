import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      required: true,
    },
    avatar: { type: String, default: "" },

    // account status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // google oauth
    googleId: { type: String, default: null },

    // 2FA
    twoFASecret: { type: String, default: null },
    twoFAEnabled: { type: Boolean, default: false },

    // tokens
    refreshToken: { type: String, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    verificationToken: { type: String, default: null },

    // account status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    suspendReason: { type: String, default: null },

    lastLogin: { type: Date, default: null },
  },
  { timestamps: true, minimize: false },
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
