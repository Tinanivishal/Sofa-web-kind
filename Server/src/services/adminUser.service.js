const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { hashPassword } = require('../utils/password');

const STAFF_ROLES = ['ADMIN', 'MANAGER', 'TECHNICIAN'];

const listAdminUsers = async ({ page = 1, limit = 50, search = '' }) => {
  const skip = (page - 1) * limit;
  const where = {
    role: { in: STAFF_ROLES },
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit };
};

const getAdminUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: { in: STAFF_ROLES },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Admin user not found');
  }

  return user;
};

const createAdminUser = async (data) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const updateAdminUser = async (id, data) => {
  const existing = await prisma.user.findFirst({
    where: { id, role: { in: STAFF_ROLES } },
  });

  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Admin user not found');
  }

  const updateData = { ...data };
  if (data.email && data.email !== existing.email) {
    const conflict = await prisma.user.findUnique({ where: { email: data.email } });
    if (conflict) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
    }
  }
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  } else {
    delete updateData.password;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

module.exports = {
  listAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
};
