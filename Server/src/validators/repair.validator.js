const { z } = require('zod');

const createRepairSchema = {
  body: z.object({
    repairType: z.enum(['UPHOLSTERY', 'FRAME', 'CUSHION', 'CLEANING', 'OTHER']),
    description: z.string().min(1, 'Description is required'),
    bookingDate: z.coerce.date(),
    slot: z.string().min(1, 'Slot is required'),
    estimatedCost: z.coerce.number().positive().optional(),
  }),
};

const getRepairByIdSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
};

const adminUpdateRepairStatusSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  }),
};

const adminAssignTechnicianSchema = {
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
  body: z.object({
    technicianId: z.string().uuid('technicianId must be a valid UUID'),
  }),
};

module.exports = {
  createRepairSchema,
  getRepairByIdSchema,
  adminUpdateRepairStatusSchema,
  adminAssignTechnicianSchema,
};

