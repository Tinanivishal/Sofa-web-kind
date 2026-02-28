const {StatusCodes} = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const getcustomers = async () => {
  const customers = await prisma.customer.findMany();
  return customers;
};

const getcustomerById = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });
  if (!customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found');
  }
  return customer;
};

const deletecustomer = async (id) => {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found');
  }

  await prisma.customer.delete({
    where: { id },
  });
};

module.exports = {
  getcustomers,
  getcustomerById,
  deletecustomer,
};