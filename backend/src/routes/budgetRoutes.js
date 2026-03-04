const express = require('express');
const { body } = require('express-validator');
const { createOrUpdateBudget, fetchBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', [body('tenDayLimit').isFloat({ gt: 0 })], validate, createOrUpdateBudget);
router.get('/', fetchBudget);

module.exports = router;
