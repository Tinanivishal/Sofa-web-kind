const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const cartService = require('../services/cart.service');

const addToCart = catchAsync(async (req, res) => {
  const cart = await cartService.addToCart(req.user.id, req.body);
  res.status(StatusCodes.OK).json(cart);
});

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.status(StatusCodes.OK).json(cart);
});

const updateCartItem = catchAsync(async (req, res) => {
  const cart = await cartService.updateCartItem(req.user.id, req.params.itemId, req.body.quantity);
  res.status(StatusCodes.OK).json(cart);
});

const deleteCartItem = catchAsync(async (req, res) => {
  const cart = await cartService.deleteCartItem(req.user.id, req.params.itemId);
  res.status(StatusCodes.OK).json(cart);
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
};

