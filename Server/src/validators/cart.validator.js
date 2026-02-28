const { z } = require('zod');

const addToCartSchema = {
  body: z.object({
    productId: z.string().uuid('productId must be a valid UUID'),
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  }),
};

const updateCartItemSchema = {
  params: z.object({
    itemId: z.string().uuid('itemId must be a valid UUID'),
  }),
  body: z.object({
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  }),
};

const deleteCartItemSchema = {
  params: z.object({
    itemId: z.string().uuid('itemId must be a valid UUID'),
  }),
};

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  deleteCartItemSchema,
};

