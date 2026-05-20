import * as paymentService from '../services/payment.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const createPaymentController = async (req, res, next) => {
  try {
    const { gigId, proposalId, freelancerId, amount, paymentMethod, milestones, description } = req.body;

    const data = {
      gigId,
      proposalId,
      clientId: req.user.id,
      freelancerId,
      amount,
      paymentMethod,
      milestones,
      description,
    };

    const payment = await paymentService.createPaymentService(data);
    res.status(201).json(apiResponse(201, payment, 'Payment created successfully'));
  } catch (error) {
    next(error);
  }
};

const getPaymentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPaymentByIdService(id);
    res.status(200).json(apiResponse(200, payment, 'Payment retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getClientPaymentsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const payments = await paymentService.getClientPaymentsService(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(apiResponse(200, payments, 'Client payments retrieved'));
  } catch (error) {
    next(error);
  }
};

const getFreelancerPaymentsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const payments = await paymentService.getFreelancerPaymentsService(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(apiResponse(200, payments, 'Freelancer payments retrieved'));
  } catch (error) {
    next(error);
  }
};

const updatePaymentStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payment = await paymentService.updatePaymentStatusService(id, status);
    res.status(200).json(apiResponse(200, payment, 'Payment status updated'));
  } catch (error) {
    next(error);
  }
};

const releaseMilestoneController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { milestoneIndex } = req.body;
    const payment = await paymentService.releaseMilestonePaymentService(id, milestoneIndex);
    res.status(200).json(apiResponse(200, payment, 'Milestone payment released'));
  } catch (error) {
    next(error);
  }
};

const getPaymentStatsController = async (req, res, next) => {
  try {
    const stats = await paymentService.getPaymentStatsService(req.user.id);
    res.status(200).json(apiResponse(200, stats, 'Payment stats retrieved'));
  } catch (error) {
    next(error);
  }
};

const processRefundController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.processRefundService(id);
    res.status(200).json(apiResponse(200, payment, 'Refund processed successfully'));
  } catch (error) {
    next(error);
  }
};

export {
  createPaymentController,
  getPaymentController,
  getClientPaymentsController,
  getFreelancerPaymentsController,
  updatePaymentStatusController,
  releaseMilestoneController,
  getPaymentStatsController,
  processRefundController,
};