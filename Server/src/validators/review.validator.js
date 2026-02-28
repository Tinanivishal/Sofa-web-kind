const { z } = require('zod');

const createReviewSchema = {
  body: z.object({
    productId: z.string().uuid('productId must be a valid UUID'),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(1, 'Comment is required'),
  }),
};

const adminApproveReviewSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
};

module.exports = {
  createReviewSchema,
  adminApproveReviewSchema,
};

