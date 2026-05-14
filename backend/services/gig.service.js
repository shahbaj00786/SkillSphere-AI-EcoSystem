import * as gigRepo from '../repositories/gig.repo.js';

const createGigService = async (data) => {
  return await gigRepo.createGig(data);
};

const getGigByIdService = async (id) => {
  const gig = await gigRepo.findGigById(id);
  if (!gig) throw new Error('Gig not found');
  await gigRepo.updateGigById(id, { $inc: { views: 1 } });
  return gig;
};

const getClientGigsService = async (clientId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await gigRepo.findGigsByClientId(clientId, limit, skip);
};

const getAllGigsService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await gigRepo.findAllGigs(limit, skip);
};

const updateGigService = async (gigId, clientId, updateData) => {
  const gig = await gigRepo.findGigById(gigId);
  if (!gig || gig.clientId.toString() !== clientId) throw new Error('Unauthorized');
  return await gigRepo.updateGigById(gigId, updateData);
};

const deleteGigService = async (gigId, clientId) => {
  const gig = await gigRepo.findGigById(gigId);
  if (!gig || gig.clientId.toString() !== clientId) throw new Error('Unauthorized');
  return await gigRepo.deleteGigById(gigId);
};

const searchGigsByCategory = async (category, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await gigRepo.findGigsByCategory(category, limit, skip);
};

export {
  createGigService,
  getGigByIdService,
  getClientGigsService,
  getAllGigsService,
  updateGigService,
  deleteGigService,
  searchGigsByCategory,
};