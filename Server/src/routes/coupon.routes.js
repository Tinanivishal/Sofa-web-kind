const express = require('express');
const couponController = require('../controllers/coupon.controller');
const validate = require('../middlewares/validate');
const { validateCouponSchema } = require('../validators/coupon.validator');

const router = express.Router();

/**
 * @openapi
 * /coupons/validate:
 *   post:
 *     tags:
 *       - Coupons
 *     summary: Validate a coupon code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Valid coupon
 *       400:
 *         description: Invalid or expired coupon
 */

// Public coupon validation
// POST /api/coupons/validate
router.post('/validate', validate(validateCouponSchema), couponController.validateCoupon);

module.exports = router;

