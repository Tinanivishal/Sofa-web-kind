const express = require('express');
const reviewController = require('../controllers/review.controller');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { createReviewSchema } = require('../validators/review.validator');

const router = express.Router();

/**
 * @openapi
 * /reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a product review (requires approval)
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
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created (pending approval)
 *
 * /products/{id}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: List approved reviews for a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of reviews
 */

// POST /api/reviews
router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);

// Note: GET /api/products/:id/reviews is handled via product routes using review controller

module.exports = router;

