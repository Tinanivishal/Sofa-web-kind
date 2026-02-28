const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: List all product categories
 *     responses:
 *       200:
 *         description: List of categories
 */

// Public categories list
router.get('/', productController.listCategories);

module.exports = router;

