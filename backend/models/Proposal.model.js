import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    estimatedDays: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    attachments: [
      {
        url: String,
        filename: String,
      },
    ],
    portfolio: [
      {
        url: String,
        title: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Proposal', proposalSchema);