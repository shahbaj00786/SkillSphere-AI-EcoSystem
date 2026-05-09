import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  companyName: { type: String, default: '' },
  industry: { type: String, default: '' },
  totalSpent: { type: Number, default: 0 },
  activeGigs: { type: Number, default: 0 },
  location: {
    city: { type: String, default: '' },
    country: { type: String, default: '' },
  },

}, { timestamps: true, minimize: false });

const clientModel = mongoose.models.client || mongoose.model('client', clientSchema);

export default clientModel;