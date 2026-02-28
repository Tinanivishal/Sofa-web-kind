const { z } = require('zod');

const adminRoles = ['ADMIN', 'MANAGER', 'TECHNICIAN'];

const createAdminUserSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(adminRoles, { message: 'Role must be ADMIN, MANAGER, or TECHNICIAN' }),
  }),
};

const updateAdminUserSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(adminRoles).optional(),
  }),
};

const getAdminUserSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
};

module.exports = {
  createAdminUserSchema,
  updateAdminUserSchema,
  getAdminUserSchema,
};
