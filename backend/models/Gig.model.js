import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    budget: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    milestones: [
      {
        name: String,
        description: String,
        amount: Number,
        dueDate: Date,
        completed: { type: Boolean, default: false },
      },
    ],
    requiredSkills: [String],
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    duration: String,
    attachments: [
      {
        url: String,
        filename: String,
      },
    ],
    proposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
      },
    ],
    selectedProposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Gig', gigSchema);