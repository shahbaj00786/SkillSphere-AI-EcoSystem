import { getFreelancerAnalytics, getClientAnalytics } from '../services/analytics.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const getFreelancerAnalyticsController = async (req, res, next) => {
  try {
    const result = await getFreelancerAnalytics(req.user.id);
    res.status(200).json(apiResponse(200, result, 'Analytics retrieved'));
  } catch (error) {
    next(error);
  }
};

const getClientAnalyticsController = async (req, res, next) => {
  try {
    const result = await getClientAnalytics(req.user.id);
    res.status(200).json(apiResponse(200, result, 'Client analytics retrieved'));
  } catch (error) {
    next(error);
  }
};

export { getFreelancerAnalyticsController, getClientAnalyticsController };