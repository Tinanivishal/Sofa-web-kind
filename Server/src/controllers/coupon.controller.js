const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const pagination = require('../middlewares/pagination');
const couponService = require('../services/coupon.service');

const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(StatusCodes.CREATED).json(coupon);
});

const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  res.status(StatusCodes.OK).json(coupon);
});

const deleteCoupon = catchAsync(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  res.status(StatusCodes.OK).json({ success: true, message: 'Coupon deleted' });
});

const validateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.validateCoupon(req.body.code);
  res.status(StatusCodes.OK).json(coupon);
});

const adminListCoupons = [
  pagination,
  catchAsync(async (req, res) => {
    const { skip, limit } = req.pagination;
    const { items, total } = await couponService.listCoupons({ skip, limit });
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

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  adminListCoupons,
};

