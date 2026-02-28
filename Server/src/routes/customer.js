const express = require('express');
const customerController = require('../controllers/customer');
const router = express.Router();

/**
 * @openapi
 * /customers:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get all customers
 *     responses:
 *       200:
 *         description: List of customers
 *       500:
 *         description: Server error
 *
 * /customers/{id}:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *       404:
 *         description: Customer not found
 *
 *   delete:
 *     tags:
 *       - Customers
 *     summary: Delete a customer by ID
 *     parameters:
 *       -  in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       204:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 */

// GET /api/customers - Get all customers
router.get('/', customerController.getcustomers);

// GET /api/customers/:id - Get a customer by ID
router.get('/:id', customerController.getcustomerById);

// DELETE /api/customers/:id - Delete a customer by ID
router.delete('/:id', customerController.deletecustomer);

module.exports = router;    