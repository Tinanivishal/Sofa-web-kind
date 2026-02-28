const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(review);
});

const listProductReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.listProductReviews(req.params.id);
  res.status(StatusCodes.OK).json(reviews);
});

const adminApproveReview = catchAsync(async (req, res) => {
  const review = await reviewService.adminApproveReview(req.params.id);
  res.status(StatusCodes.OK).json(review);
});

module.exports = {
  createReview,
  listProductReviews,
  adminApproveReview,
};

