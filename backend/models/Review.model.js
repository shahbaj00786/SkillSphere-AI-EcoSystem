import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    categories: {
      communication: { type: Number, min: 1, max: 5 },
      quality: { type: Number, min: 1, max: 5 },
      timeliness: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);