const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const validate = require('../middlewares/validate');

const productController = require('../controllers/product.controller');
const orderController = require('../controllers/order.controller');
const repairController = require('../controllers/repair.controller');
const couponController = require('../controllers/coupon.controller');
const reviewController = require('../controllers/review.controller');
const customerController = require('../controllers/customer.controller');
const adminUserController = require('../controllers/adminUser.controller');
const {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
} = require('../validators/product.validator');
const { adminUpdateOrderStatusSchema } = require('../validators/order.validator');
const {
  adminUpdateRepairStatusSchema,
  adminAssignTechnicianSchema,
} = require('../validators/repair.validator');
const {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
} = require('../validators/coupon.validator');
const { adminApproveReviewSchema } = require('../validators/review.validator');
const { updateCustomerSchema, updateCustomerStatusSchema } = require('../validators/customer.validator');
const {
  createAdminUserSchema,
  updateAdminUserSchema,
  getAdminUserSchema,
} = require('../validators/adminUser.validator');

const router = express.Router();

/**
 * @openapi
 * /admin/products:
 *   post:
 *     tags:
 *       - Admin - Products
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created
 *
 * /admin/products/{id}:
 *   put:
 *     tags:
 *       - Admin - Products
 *     summary: Update a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     tags:
 *       - Admin - Products
 *     summary: Delete a product (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Product deleted
 *
 * /admin/products/{id}/status:
 *   patch:
 *     tags:
 *       - Admin - Products
 *     summary: Update product status (ACTIVE/INACTIVE)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product status updated
 *
 * /admin/orders:
 *   get:
 *     tags:
 *       - Admin - Orders
 *     summary: List all orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of orders
 *
 * /admin/orders/{id}/status:
 *   patch:
 *     tags:
 *       - Admin - Orders
 *     summary: Update order status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order status updated
 *
 * /admin/repairs:
 *   get:
 *     tags:
 *       - Admin - Repairs
 *     summary: List all repair bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of repair bookings
 *
 * /admin/repairs/{id}/status:
 *   patch:
 *     tags:
 *       - Admin - Repairs
 *     summary: Update repair booking status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Repair booking status updated
 *
 * /admin/repairs/{id}/assign:
 *   patch:
 *     tags:
 *       - Admin - Repairs
 *     summary: Assign a technician to a repair booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Technician assigned
 *
 * /admin/coupons:
 *   post:
 *     tags:
 *       - Admin - Coupons
 *     summary: Create a coupon
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Coupon created
 *
 * /admin/coupons/{id}:
 *   put:
 *     tags:
 *       - Admin - Coupons
 *     summary: Update a coupon
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Coupon updated
 *   delete:
 *     tags:
 *       - Admin - Coupons
 *     summary: Delete a coupon
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Coupon deleted
 *
 * /admin/reviews/{id}/approve:
 *   patch:
 *     tags:
 *       - Admin - Reviews
 *     summary: Approve a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review approved
 */

router.use(authenticate);

// RBAC helpers
const adminOnly = authorize('ADMIN');
const adminOrManager = authorize('ADMIN', 'MANAGER');
const adminManagerTechnician = authorize('ADMIN', 'MANAGER', 'TECHNICIAN');

// Product management (ADMIN & MANAGER; delete ADMIN only)
// POST /api/admin/products
router.post('/products', adminOrManager, validate(createProductSchema), productController.createProduct);

// PUT /api/admin/products/:id
router.put('/products/:id', adminOrManager, validate(updateProductSchema), productController.updateProduct);

// DELETE /api/admin/products/:id (ADMIN only)
router.delete('/products/:id', adminOnly, productController.deleteProduct);

// PATCH /api/admin/products/:id/status
router.patch(
  '/products/:id/status',
  adminOrManager,
  validate(updateProductStatusSchema),
  productController.updateProductStatus,
);

// Orders (ADMIN & MANAGER)
// GET /api/admin/orders
router.get('/orders', adminOrManager, orderController.adminListOrders);

// PATCH /api/admin/orders/:id/status
router.patch(
  '/orders/:id/status',
  adminOrManager,
  validate(adminUpdateOrderStatusSchema),
  orderController.adminUpdateOrderStatus,
);

// Repair bookings (ADMIN, MANAGER, TECHNICIAN for status; ADMIN/MANAGER for assign)
// GET /api/admin/repairs
router.get('/repairs', adminManagerTechnician, repairController.adminListRepairs);

// PATCH /api/admin/repairs/:id/status
router.patch(
  '/repairs/:id/status',
  adminManagerTechnician,
  validate(adminUpdateRepairStatusSchema),
  repairController.adminUpdateRepairStatus,
);
// Customers (ADMIN only)
// GET /api/admin/customers
router.get('/customers', adminOnly, customerController.getAllCustomers);

// GET /api/admin/customers/:id
router.get('/customers/:id', adminOnly, customerController.getCustomerById);

// PUT /api/admin/customers/:id
router.put('/customers/:id', adminOnly, validate(updateCustomerSchema), customerController.updateCustomer);

// DELETE /api/admin/customers/:id
router.delete('/customers/:id', adminOnly, customerController.deleteCustomer);

// PATCH /api/admin/customers/:id/status
router.patch(
  '/customers/:id/status',
  adminOnly,
  validate(updateCustomerStatusSchema),
  customerController.updateCustomerStatus,
);

// Admin users (ADMIN only) - create, list, get, update
// GET /api/admin/admins
router.get('/admins', adminOnly, adminUserController.listAdminUsers);

// GET /api/admin/admins/:id
router.get('/admins/:id', adminOnly, validate(getAdminUserSchema), adminUserController.getAdminUserById);

// POST /api/admin/admins (register new admin/manager/technician)
router.post('/admins', adminOnly, validate(createAdminUserSchema), adminUserController.createAdminUser);

// PUT /api/admin/admins/:id
router.put('/admins/:id', adminOnly, validate(updateAdminUserSchema), adminUserController.updateAdminUser);

// PATCH /api/admin/repairs/:id/assign
router.patch(
  '/repairs/:id/assign',
  adminOrManager,
  validate(adminAssignTechnicianSchema),
  repairController.adminAssignTechnician,
);

// Coupons (ADMIN & MANAGER)
// GET /api/admin/coupons
router.get('/coupons', adminOrManager, couponController.adminListCoupons);

// POST /api/admin/coupons
router.post('/coupons', adminOrManager, validate(createCouponSchema), couponController.createCoupon);

// PUT /api/admin/coupons/:id
router.put('/coupons/:id', adminOrManager, validate(updateCouponSchema), couponController.updateCoupon);

// DELETE /api/admin/coupons/:id
router.delete('/coupons/:id', adminOrManager, validate(deleteCouponSchema), couponController.deleteCoupon);

// Reviews (ADMIN & MANAGER)
// PATCH /api/admin/reviews/:id/approve
router.patch(
  '/reviews/:id/approve',
  adminOrManager,
  validate(adminApproveReviewSchema),
  reviewController.adminApproveReview,
);


module.exports = router;

