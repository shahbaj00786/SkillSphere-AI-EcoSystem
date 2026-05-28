import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "user_suspended",
        "user_verified",
        "gig_approved",
        "gig_removed",
        "fraud_detected",
        "payment_refunded",
        "dispute_resolved",
      ],
      required: true,
    },
    targetId: mongoose.Schema.Types.ObjectId,
    targetModel: {
      type: String,
      enum: ["User", "Gig", "Payment", "Dispute"],
    },
    description: String,
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true },
);

export default mongoose.model("AdminLog", adminLogSchema);
