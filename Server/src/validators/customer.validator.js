const { z } = require('zod');

const updateCustomerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').optional(),
    email: z.string().email('Please provide a valid email address').optional(),
    phone: z.string().optional(),
    isActive: z.boolean('isActive must be a boolean value').optional(),
  }),
};

const updateCustomerStatusSchema = {
  body: z.object({
    status: z.enum(['Active', 'Inactive'], 'Status must be either Active or Inactive'),
  }),
};

module.exports = {
  updateCustomerSchema,
  updateCustomerStatusSchema,
};
