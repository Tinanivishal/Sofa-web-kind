const express = require('express');
const repairController = require('../controllers/repair.controller');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { createRepairSchema, getRepairByIdSchema } = require('../validators/repair.validator');

const router = express.Router();

/**
 * @openapi
 * /repairs:
 *   post:
 *     tags:
 *       - Repairs
 *     summary: Create a new repair booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - repairType
 *               - description
 *               - bookingDate
 *               - slot
 *             properties:
 *               repairType:
 *                 type: string
 *                 enum: [UPHOLSTERY, FRAME, CUSHION, CLEANING, OTHER]
 *               description:
 *                 type: string
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *               slot:
 *                 type: string
 *               estimatedCost:
 *                 type: number
 *     responses:
 *       201:
 *         description: Repair booking created
 *   get:
 *     tags:
 *       - Repairs
 *     summary: List current user's repair bookings
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
 * /repairs/{id}:
 *   get:
 *     tags:
 *       - Repairs
 *     summary: Get a specific repair booking for the current user
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
 *         description: Repair booking detail
 *       404:
 *         description: Repair booking not found
 */

router.use(authenticate);

// User repair booking APIs
// POST /api/repairs
router.post('/', validate(createRepairSchema), repairController.createRepair);

// GET /api/repairs
router.get('/', repairController.listUserRepairs);

// GET /api/repairs/:id
router.get('/:id', validate(getRepairByIdSchema), repairController.getRepairById);

module.exports = router;

