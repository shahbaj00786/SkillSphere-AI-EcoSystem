import Payment from '../models/Payment.model.js';
import Proposal from '../models/Proposal.model.js';
import Review from '../models/Review.model.js';
import Gig from '../models/Gig.model.js';
import mongoose from 'mongoose';

const getFreelancerAnalytics = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);

  const [paymentStats, monthlyEarnings, proposalStats, reviewStats, gigStats] = await Promise.all([
    // Overall payment stats
    Payment.aggregate([
      { $match: { freelancerId: uid } },
      { $group: {
        _id: null,
        totalEarnings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$freelancerAmount', 0] } },
        pendingAmount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$freelancerAmount', 0] } },
        completedPayments: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        totalPayments: { $sum: 1 },
      }}
    ]),

    // Monthly earnings - last 6 months
    Payment.aggregate([
      { $match: { freelancerId: uid, status: 'completed' } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        amount: { $sum: '$freelancerAmount' },
        count: { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
    ]),

    // Proposal stats
    Proposal.aggregate([
      { $match: { freelancerId: uid } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
      }}
    ]),

    // Review stats
    Review.aggregate([
      { $match: { freelancerId: uid } },
      { $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        avgCommunication: { $avg: '$communication' },
        avgQuality: { $avg: '$quality' },
        avgTimeliness: { $avg: '$timeliness' },
      }}
    ]),

    // Gig application stats
    Proposal.find({ freelancerId: uid }).populate('gigId', 'title status').sort({ createdAt: -1 }).limit(5),
  ]);

  const stats = paymentStats[0] || { totalEarnings: 0, pendingAmount: 0, completedPayments: 0, totalPayments: 0 };
  const proposalMap = {};
  proposalStats.forEach(p => { proposalMap[p._id] = p.count; });

  const totalProposals = Object.values(proposalMap).reduce((a, b) => a + b, 0);
  const acceptedProposals = proposalMap['accepted'] || 0;

  return {
    earnings: {
      total: stats.totalEarnings || 0,
      pending: stats.pendingAmount || 0,
      completedJobs: stats.completedPayments || 0,
    },
    proposals: {
      total: totalProposals,
      accepted: acceptedProposals,
      pending: proposalMap['pending'] || 0,
      rejected: proposalMap['rejected'] || 0,
      acceptanceRate: totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0,
    },
    reviews: reviewStats[0] || { avgRating: 0, totalReviews: 0 },
    monthlyEarnings: monthlyEarnings.map(m => ({
      label: new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'short' }),
      amount: m.amount,
      count: m.count,
    })),
    recentGigs: gigStats,
  };
};

const getClientAnalytics = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);

  const [paymentStats, gigStats, proposalStats] = await Promise.all([
    Payment.aggregate([
      { $match: { clientId: uid } },
      { $group: {
        _id: null,
        totalSpent: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } },
        pendingPayments: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        completedPayments: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      }}
    ]),
    Gig.aggregate([
      { $match: { clientId: uid } },
      { $group: { _id: '$status', count: { $sum: 1 } }}
    ]),
    Gig.find({ clientId: uid }).populate('proposals').sort({ createdAt: -1 }).limit(5),
  ]);

  const stats = paymentStats[0] || { totalSpent: 0, pendingPayments: 0, completedPayments: 0 };
  const gigMap = {};
  gigStats.forEach(g => { gigMap[g._id] = g.count; });

  const totalProposalsReceived = proposalStats.reduce((sum, g) => sum + (g.proposals?.length || 0), 0);

  return {
    spending: {
      total: stats.totalSpent || 0,
      completedJobs: stats.completedPayments || 0,
      pendingPayments: stats.pendingPayments || 0,
    },
    gigs: {
      open: gigMap['open'] || 0,
      inProgress: gigMap['in_progress'] || 0,
      completed: gigMap['completed'] || 0,
      total: Object.values(gigMap).reduce((a, b) => a + b, 0),
    },
    proposalsReceived: totalProposalsReceived,
    recentGigs: proposalStats,
  };
};

export { getFreelancerAnalytics, getClientAnalytics };