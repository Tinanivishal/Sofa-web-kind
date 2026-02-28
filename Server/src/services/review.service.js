const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const createReview = async (userId, { productId, rating, comment }) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
  });

  return review;
};

const listProductReviews = async (productId) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      approved: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return reviews;
};

const adminApproveReview = async (id) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
  }

  return prisma.review.update({
    where: { id },
    data: {
      approved: true,
    },
  });
};

module.exports = {
  createReview,
  listProductReviews,
  adminApproveReview,
};

