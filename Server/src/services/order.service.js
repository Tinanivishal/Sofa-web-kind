const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const createOrderFromCart = async (userId, { couponCode }) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart is empty');
  }

  // Validate stock
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock for product ${item.product.name}`,
      );
    }
  }

  let discountValue = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const now = new Date();
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });
    if (!coupon || coupon.expiryDate < now) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired coupon');
    }
    appliedCoupon = coupon;
  }

  // Calculate total
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountValue = (subtotal * Number(appliedCoupon.discountValue)) / 100;
    } else {
      discountValue = Number(appliedCoupon.discountValue);
    }
  }

  const totalAmount = Math.max(subtotal - discountValue, 0);

  // Transactional operation
  const order = await prisma.$transaction(async (tx) => {
    // Decrement stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const createdOrder = await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  return order;
};

const listUserOrders = async (userId, { skip, limit }) => {
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({
      where: { userId },
    }),
  ]);

  return { items, total };
};

const getOrderByIdForUser = async (userId, id) => {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return order;
};

const adminListOrders = async ({ skip, limit }) => {
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count(),
  ]);

  return { items, total };
};

const adminUpdateOrderStatus = async (id, status) => {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return prisma.order.update({
    where: { id },
    data: { status },
  });
};

module.exports = {
  createOrderFromCart,
  listUserOrders,
  getOrderByIdForUser,
  adminListOrders,
  adminUpdateOrderStatus,
};

