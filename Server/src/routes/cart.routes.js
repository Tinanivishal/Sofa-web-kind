const express = require('express');
const cartController = require('../controllers/cart.controller');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { addToCartSchema, updateCartItemSchema, deleteCartItemSchema } = require('../validators/cart.validator');

const router = express.Router();

/**
 * @openapi
 * /cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add a product to the cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Updated cart
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get current user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 *
 * /cart/{itemId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update quantity of a cart item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Updated cart
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove an item from the cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Updated cart
 */

router.use(authenticate);

// POST /api/cart
router.post('/', validate(addToCartSchema), cartController.addToCart);

// GET /api/cart
router.get('/', cartController.getCart);

// PUT /api/cart/:itemId
router.put('/:itemId', validate(updateCartItemSchema), cartController.updateCartItem);

// DELETE /api/cart/:itemId
router.delete('/:itemId', validate(deleteCartItemSchema), cartController.deleteCartItem);

module.exports = router;

