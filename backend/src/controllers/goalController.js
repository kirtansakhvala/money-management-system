const { createGoal, updateGoal, getGoals } = require('../models/goalModel');

const addGoal = async (req, res, next) => {
  try {
    const { title, targetAmount, savedAmount = 0 } = req.body;
    const id = await createGoal({ userId: req.user.id, title, targetAmount, savedAmount });
    return res.status(201).json({ message: 'Goal created', id });
  } catch (error) {
    return next(error);
  }
};

const editGoal = async (req, res, next) => {
  try {
    const updated = await updateGoal({
      userId: req.user.id,
      goalId: req.params.id,
      savedAmount: req.body.savedAmount,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    return res.json({ message: 'Goal updated' });
  } catch (error) {
    return next(error);
  }
};

const listGoals = async (req, res, next) => {
  try {
    const goals = await getGoals(req.user.id);
    return res.json({ data: goals });
  } catch (error) {
    return next(error);
  }
};

module.exports = { addGoal, editGoal, listGoals };
