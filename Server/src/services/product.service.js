const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const listProducts = async ({ skip, limit, filters }) => {
  const where = {
    status: 'ACTIVE',
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice) {
      where.price.lte = filters.maxPrice;
    }
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
    },
  });

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  return product;
};

const listCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

const createProduct = async (data) => {
  const { images = [], ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      images: {
        create: images.map((url) => ({ imageUrl: url })),
      },
    },
    include: {
      images: true,
    },
  });

  return product;
};

const updateProduct = async (id, data) => {
  const { images, ...productData } = data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(Array.isArray(images)
        ? {
            images: {
              deleteMany: {},
              create: images.map((url) => ({ imageUrl: url })),
            },
          }
        : {}),
    },
    include: {
      images: true,
    },
  });

  return product;
};

const deleteProduct = async (id) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  await prisma.product.delete({ where: { id } });
};

const updateProductStatus = async (id, status) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  return prisma.product.update({
    where: { id },
    data: { status },
  });
};

module.exports = {
  listProducts,
  getProductById,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
};

