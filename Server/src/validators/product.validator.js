const { z } = require('zod');

const productBase = {
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock must be >= 0'),
  categoryId: z.string().uuid('categoryId must be a valid UUID'),
  status: z
    .enum(['ACTIVE', 'INACTIVE'])
    .optional(),
  images: z.array(z.string().url()).optional(),
};

const createProductSchema = {
  body: z.object(productBase),
};

const updateProductSchema = {
  body: z.object({
    name: productBase.name.optional(),
    description: productBase.description.optional(),
    price: productBase.price.optional(),
    stock: productBase.stock.optional(),
    categoryId: productBase.categoryId.optional(),
    status: productBase.status,
    images: productBase.images,
  }),
};

const updateProductStatusSchema = {
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE']),
  }),
};

module.exports = {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
};

