const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllCustomers = async ({ page = 1, limit = 50, search = '' }) => {
  const skip = (page - 1) * limit;
  
  const where = search
    ? {
        role: 'USER',
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : { role: 'USER' };

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            repairBookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  // Calculate additional customer metrics
  const customersWithMetrics = await Promise.all(
    customers.map(async (customer) => {
      const [orderStats, repairStats] = await Promise.all([
        prisma.order.aggregate({
          where: { userId: customer.id },
          _sum: { totalAmount: true },
          _max: { createdAt: true },
        }),
        prisma.repairBooking.findMany({
          where: { userId: customer.id },
          select: {
            id: true,
            repairType: true,
            bookingDate: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      return {
        ...customer,
        phone: null,
        isActive: true,
        totalOrders: customer._count.orders,
        totalRepairs: customer._count.repairBookings,
        totalSpent: orderStats._sum.totalAmount || 0,
        lastOrder: orderStats._max.createdAt,
        recentRepairs: repairStats,
      };
    })
  );

  return {
    customers: customersWithMetrics,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getCustomerById = async (id) => {
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!customer) {
    return null;
  }

  // Get customer's orders and repair bookings
  const [orders, repairs, orderStats] = await Promise.all([
    prisma.order.findMany({
      where: { userId: id },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.repairBooking.findMany({
      where: { userId: id },
      select: {
        id: true,
        repairType: true,
        description: true,
        bookingDate: true,
        slot: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.order.aggregate({
      where: { userId: id },
      _sum: { totalAmount: true },
      _count: { id: true },
      _max: { createdAt: true },
    }),
  ]);

  return {
    ...customer,
    phone: null,
    isActive: true,
    orders,
    repairs,
    totalOrders: orderStats._count.id,
    totalSpent: orderStats._sum.totalAmount || 0,
    lastOrder: orderStats._max.createdAt,
  };
};

const updateCustomer = async (id, updateData) => {
  const { name, email } = updateData;

  const updatedCustomer = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
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

  return { ...updatedCustomer, phone: null, isActive: true };
};

const deleteCustomer = async (id) => {
  try {
    // Delete related records (cart cascades to cart items; orders cascade to order items)
    await Promise.all([
      prisma.order.deleteMany({ where: { userId: id } }),
      prisma.repairBooking.deleteMany({ where: { userId: id } }),
      prisma.review.deleteMany({ where: { userId: id } }),
      prisma.cart.deleteMany({ where: { userId: id } }),
    ]);

    const deletedCustomer = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return deletedCustomer;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

const updateCustomerStatus = async (id, status) => {
  // User model has no isActive; return customer unchanged with isActive derived from status
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!customer) return null;
  return { ...customer, phone: null, isActive: status === 'Active' };
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateCustomerStatus,
};
