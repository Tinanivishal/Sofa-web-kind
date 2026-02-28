const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const adminUserService = require('../services/adminUser.service');

const listAdminUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 50, search = '' } = req.query;
  const result = await adminUserService.listAdminUsers({
    page: parseInt(page, 10) || 1,
    limit: Math.min(parseInt(limit, 10) || 50, 100),
    search: (search || '').trim(),
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: result.users,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
});

const getAdminUserById = catchAsync(async (req, res) => {
  const user = await adminUserService.getAdminUserById(req.params.id);
  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
});

const createAdminUser = catchAsync(async (req, res) => {
  const user = await adminUserService.createAdminUser(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Admin user created successfully',
    data: user,
  });
});

const updateAdminUser = catchAsync(async (req, res) => {
  const user = await adminUserService.updateAdminUser(req.params.id, req.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Admin user updated successfully',
    data: user,
  });
});

module.exports = {
  listAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
};
