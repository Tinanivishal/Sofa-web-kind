const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const pagination = require('../middlewares/pagination');
const repairService = require('../services/repair.service');

const createRepair = catchAsync(async (req, res) => {
  const booking = await repairService.createRepairBooking(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(booking);
});

const listUserRepairs = [
  pagination,
  catchAsync(async (req, res) => {
    const { skip, limit } = req.pagination;
    const { items, total } = await repairService.listUserRepairs(req.user.id, { skip, limit });
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

const getRepairById = catchAsync(async (req, res) => {
  const booking = await repairService.getRepairByIdForUser(req.user.id, req.params.id);
  res.status(StatusCodes.OK).json(booking);
});

const adminListRepairs = [
  pagination,
  catchAsync(async (req, res) => {
    const { skip, limit } = req.pagination;
    const { items, total } = await repairService.adminListRepairs({ skip, limit });
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

const adminUpdateRepairStatus = catchAsync(async (req, res) => {
  const booking = await repairService.adminUpdateRepairStatus(
    req.params.id,
    req.body.status,
    req.user,
  );
  res.status(StatusCodes.OK).json(booking);
});

const adminAssignTechnician = catchAsync(async (req, res) => {
  const booking = await repairService.adminAssignTechnician(req.params.id, req.body.technicianId);
  res.status(StatusCodes.OK).json(booking);
});

module.exports = {
  createRepair,
  listUserRepairs,
  getRepairById,
  adminListRepairs,
  adminUpdateRepairStatus,
  adminAssignTechnician,
};

