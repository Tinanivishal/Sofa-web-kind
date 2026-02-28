const { z } = require('zod');

const baseCouponFields = {
  code: z.string().min(1, 'Code is required'),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.coerce.number().positive('Discount value must be positive'),
  expiryDate: z.coerce.date(),
  usageLimit: z.coerce.number().int().positive().optional(),
};

const createCouponSchema = {
  body: z.object(baseCouponFields),
};

const updateCouponSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
  body: z.object({
    code: baseCouponFields.code.optional(),
    discountType: baseCouponFields.discountType.optional(),
    discountValue: baseCouponFields.discountValue.optional(),
    expiryDate: baseCouponFields.expiryDate.optional(),
    usageLimit: baseCouponFields.usageLimit,
  }),
};

const deleteCouponSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
};

const validateCouponSchema = {
  body: z.object({
    code: z.string().min(1, 'Code is required'),
  }),
};

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
  validateCouponSchema,
};

