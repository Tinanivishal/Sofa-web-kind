const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return cart;
};

const addToCart = async (userId, { productId, quantity }) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== 'ACTIVE') {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found or inactive');
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find((i) => i.productId === productId);

  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
      include: {
        product: true,
        cart: true,
      },
    });
    return updatedItem.cart;
  }

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  return getOrCreateCart(userId);
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return cart;
};

const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });
  if (!cart) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found');
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.cartId !== cart.id) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cart item not found');
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getOrCreateCart(userId);
};

const deleteCartItem = async (userId, itemId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });
  if (!cart) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found');
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.cartId !== cart.id) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cart item not found');
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getOrCreateCart(userId);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
};

