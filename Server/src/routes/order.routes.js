const express = require('express');
const orderController = require('../controllers/order.controller');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { createOrderSchema, getOrderByIdSchema } = require('../validators/order.validator');

const router = express.Router();

/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create an order from the current cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart empty or validation error
 *   get:
 *     tags:
 *       - Orders
 *     summary: List current user's orders
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
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a specific order for the current user
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
 *         description: Order detail
 *       404:
 *         description: Order not found
 */

router.use(authenticate);

// POST /api/orders
router.post('/', validate(createOrderSchema), orderController.createOrder);

// GET /api/orders
router.get('/', orderController.listUserOrders);

// GET /api/orders/:id
router.get('/:id', validate(getOrderByIdSchema), orderController.getOrderById);

module.exports = router;

