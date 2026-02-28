const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const createRepairBooking = async (userId, data) => {
  const booking = await prisma.repairBooking.create({
    data: {
      ...data,
      userId,
    },
  });

  return booking;
};

const listUserRepairs = async (userId, { skip, limit }) => {
  const [items, total] = await Promise.all([
    prisma.repairBooking.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { bookingDate: 'desc' },
    }),
    prisma.repairBooking.count({ where: { userId } }),
  ]);

  return { items, total };
};

const getRepairByIdForUser = async (userId, id) => {
  const booking = await prisma.repairBooking.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Repair booking not found');
  }

  return booking;
};

const adminListRepairs = async ({ skip, limit }) => {
  const [items, total] = await Promise.all([
    prisma.repairBooking.findMany({
      skip,
      take: limit,
      include: {
        user: true,
        assignedTechnician: true,
      },
      orderBy: { bookingDate: 'desc' },
    }),
    prisma.repairBooking.count(),
  ]);

  return { items, total };
};

const adminUpdateRepairStatus = async (id, status, currentUser) => {
  const booking = await prisma.repairBooking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Repair booking not found');
  }

  // If technician trying to update, ensure it's their booking
  if (currentUser.role === 'TECHNICIAN' && booking.assignedTechnicianId !== currentUser.id) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only update your assigned bookings');
  }

  return prisma.repairBooking.update({
    where: { id },
    data: { status },
  });
};

const adminAssignTechnician = async (id, technicianId) => {
  const [booking, technicianUser] = await Promise.all([
    prisma.repairBooking.findUnique({ where: { id } }),
    prisma.user.findUnique({ where: { id: technicianId } }),
  ]);

  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Repair booking not found');
  }

  if (!technicianUser || technicianUser.role !== 'TECHNICIAN') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Technician user not found');
  }

  return prisma.repairBooking.update({
    where: { id },
    data: {
      assignedTechnicianId: technicianId,
      status: 'ASSIGNED',
    },
    include: {
      assignedTechnician: true,
    },
  });
};

module.exports = {
  createRepairBooking,
  listUserRepairs,
  getRepairByIdForUser,
  adminListRepairs,
  adminUpdateRepairStatus,
  adminAssignTechnician,
};

