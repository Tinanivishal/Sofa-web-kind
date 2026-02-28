const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const pagination = require('../middlewares/pagination');
const orderService = require('../services/order.service');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrderFromCart(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(order);
});

const listUserOrders = [
  pagination,
  catchAsync(async (req, res) => {
    const { skip, limit } = req.pagination;
    const { items, total } = await orderService.listUserOrders(req.user.id, { skip, limit });
    res.status(StatusCodes.OK).json({
      data: items,
      meta: {
        total,
        page: req.pagination.page,
        limit,
      },
    });
  }),
];

const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByIdForUser(req.user.id, req.params.id);
  res.status(StatusCodes.OK).json(order);
});

const adminListOrders = [
  pagination,
  catchAsync(async (req, res) => {
    const { skip, limit } = req.pagination;
    const { items, total } = await orderService.adminListOrders({ skip, limit });
    res.status(StatusCodes.OK).json({
      data: items,
      meta: {
        total,
        page: req.pagination.page,
        limit,
      },
    });
  }),
];

const adminUpdateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.adminUpdateOrderStatus(req.params.id, req.body.status);
  res.status(StatusCodes.OK).json(order);
});

module.exports = {
  createOrder,
  listUserOrders,
  getOrderById,
  adminListOrders,
  adminUpdateOrderStatus,
};

