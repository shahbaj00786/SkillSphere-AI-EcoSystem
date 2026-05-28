import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, default: "" },
    skills: [
      {
        name: { type: String },
        proficiencyLevel: {
          type: String,
          enum: ["beginner", "intermediate", "expert"],
        },
      },
    ],
    hourlyRate: { type: Number, default: 0 },
    portfolioItems: [
      {
        title: { type: String },
        url: { type: String },
        imageUrl: { type: String },
        description: { type: String },
      },
    ],
    certifications: [
      {
        name: { type: String },
        issuer: { type: String },
        year: { type: String },
      },
    ],
    workExperience: [
      {
        company: { type: String },
        role: { type: String },
        from: { type: String },
        to: { type: String },
      },
    ],
    resumeUrl: { type: String, default: "" },
    availabilitySlots: [
      {
        date: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        isBooked: { type: Boolean, default: false },
      },
    ],
    isVerified: { type: Boolean, default: false },
    verificationBadge: {
      type: String,
      enum: ["top_rated", "rising", "verified", "none"],
      default: "none",
    },
    reputationScore: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    completedGigs: { type: Number, default: 0 },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    pricingType: {
      type: String,
      enum: ["hourly", "milestone", "both"],
      default: "hourly",
    },
  },
  { timestamps: true, minimize: false },
);

const freelancerModel =
  mongoose.models.Freelancer || mongoose.model("Freelancer", freelancerSchema);

export default freelancerModel;
