const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const pagination = require('../middlewares/pagination');
const productService = require('../services/product.service');

const listProducts = [
  pagination,
  catchAsync(async (req, res) => {
    const { skip, limit } = req.pagination;
    const { search, categoryId, minPrice, maxPrice } = req.query;

    const filters = {
      search,
      categoryId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const { items, total } = await productService.listProducts({ skip, limit, filters });

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

const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(StatusCodes.OK).json(product);
});

const listCategories = catchAsync(async (req, res) => {
  const categories = await productService.listCategories();
  res.status(StatusCodes.OK).json(categories);
});

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(StatusCodes.CREATED).json(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(StatusCodes.OK).json(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

const updateProductStatus = catchAsync(async (req, res) => {
  const product = await productService.updateProductStatus(req.params.id, req.body.status);
  res.status(StatusCodes.OK).json(product);
});

module.exports = {
  listProducts,
  getProductById,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
};

