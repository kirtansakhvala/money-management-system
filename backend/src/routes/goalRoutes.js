const express = require('express');
const { body } = require('express-validator');
const { addGoal, editGoal, listGoals } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [body('title').notEmpty(), body('targetAmount').isFloat({ gt: 0 }), body('savedAmount').optional().isFloat({ min: 0 })],
  validate,
  addGoal,
);
router.put('/:id', [body('savedAmount').isFloat({ min: 0 })], validate, editGoal);
router.get('/', listGoals);

module.exports = router;
