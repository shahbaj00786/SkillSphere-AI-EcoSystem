import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    freelancerAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'escrow', 'completed', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay'],
      required: true,
    },
    transactionId: String,
    milestones: [
      {
        name: String,
        amount: Number,
        status: {
          type: String,
          enum: ['pending', 'paid', 'released'],
          default: 'pending',
        },
        dueDate: Date,
        paidDate: Date,
      },
    ],
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);