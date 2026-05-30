import { getAIGigMatches, generateProposal, getTrendingSkills } from '../services/matching.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const getMatchedGigsController = async (req, res, next) => {
  try {
    const result = await getAIGigMatches(req.user.id);
    res.status(200).json(apiResponse(200, result, 'AI matches retrieved'));
  } catch (error) {
    next(error);
  }
};

const generateProposalController = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const result = await generateProposal(gigId, req.user.id);
    res.status(200).json(apiResponse(200, result, 'Proposal generated'));
  } catch (error) {
    next(error);
  }
};

const getTrendingSkillsController = async (req, res, next) => {
  try {
    const result = await getTrendingSkills();
    res.status(200).json(apiResponse(200, result, 'Trending skills retrieved'));
  } catch (error) {
    next(error);
  }
};

export { getMatchedGigsController, generateProposalController, getTrendingSkillsController };