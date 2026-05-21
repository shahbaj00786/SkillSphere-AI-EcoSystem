import * as disputeService from '../services/dispute.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const createDisputeController = async (req, res, next) => {
  try {
    const { paymentId, gigId, reason, description, evidence } = req.body;
    const data = {
      paymentId,
      gigId,
      raisedBy: req.user.id,
      reason,
      description,
      evidence,
    };

    const dispute = await disputeService.createDisputeService(data);
    res.status(201).json(apiResponse(201, dispute, 'Dispute created successfully'));
  } catch (error) {
    next(error);
  }
};

const getDisputeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dispute = await disputeService.getDisputeByIdService(id);
    res.status(200).json(apiResponse(200, dispute, 'Dispute retrieved'));
  } catch (error) {
    next(error);
  }
};

const getOpenDisputesController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const disputes = await disputeService.getOpenDisputesService(parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, disputes, 'Open disputes retrieved'));
  } catch (error) {
    next(error);
  }
};

const getUserDisputesController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const disputes = await disputeService.getUserDisputesService(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(apiResponse(200, disputes, 'User disputes retrieved'));
  } catch (error) {
    next(error);
  }
};

const updateDisputeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dispute = await disputeService.updateDisputeService(id, req.body);
    res.status(200).json(apiResponse(200, dispute, 'Dispute updated'));
  } catch (error) {
    next(error);
  }
};

const resolveDisputeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const dispute = await disputeService.resolveDisputeService(id, resolution, req.user.id);
    res.status(200).json(apiResponse(200, dispute, 'Dispute resolved'));
  } catch (error) {
    next(error);
  }
};

const rejectDisputeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dispute = await disputeService.rejectDisputeService(id);
    res.status(200).json(apiResponse(200, dispute, 'Dispute rejected'));
  } catch (error) {
    next(error);
  }
};

export {
  createDisputeController,
  getDisputeController,
  getOpenDisputesController,
  getUserDisputesController,
  updateDisputeController,
  resolveDisputeController,
  rejectDisputeController,
};