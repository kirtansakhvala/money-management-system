const express = require('express');
const { body } = require('express-validator');
const { createIncome, getIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [body('amount').isFloat({ gt: 0 }), body('source').notEmpty(), body('date').isISO8601()],
  validate,
  createIncome,
);
router.get('/', getIncome);

module.exports = router;
