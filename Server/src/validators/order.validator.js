const { z } = require('zod');

const createOrderSchema = {
  body: z.object({
    // In future you can accept couponCode, address, etc.
    couponCode: z.string().optional(),
  }),
};

const getOrderByIdSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
};

const adminUpdateOrderStatusSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  }),
};

module.exports = {
  createOrderSchema,
  getOrderByIdSchema,
  adminUpdateOrderStatusSchema,
};

