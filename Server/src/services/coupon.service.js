const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const createCoupon = async (data) => {
  const existing = await prisma.coupon.findUnique({
    where: { code: data.code },
  });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Coupon code already exists');
  }

  const coupon = await prisma.coupon.create({
    data,
  });

  return coupon;
};

const updateCoupon = async (id, data) => {
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found');
  }

  if (data.code && data.code !== existing.code) {
    const conflict = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (conflict) {
      throw new ApiError(StatusCodes.CONFLICT, 'Coupon code already exists');
    }
  }

  const coupon = await prisma.coupon.update({
    where: { id },
    data,
  });

  return coupon;
};

const deleteCoupon = async (id) => {
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found');
  }

  await prisma.coupon.delete({
    where: { id },
  });
};

const validateCoupon = async (code) => {
  const now = new Date();

  const coupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (!coupon || coupon.expiryDate < now) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired coupon');
  }

  return coupon;
};

const listCoupons = async ({ skip, limit }) => {
  const [items, total] = await Promise.all([
    prisma.coupon.findMany({
      skip,
      take: limit,
      orderBy: { code: 'asc' },
    }),
    prisma.coupon.count(),
  ]);
  return { items, total };
};

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  listCoupons,
};

