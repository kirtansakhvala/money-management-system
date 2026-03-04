const { setBudget, getBudget } = require('../models/budgetModel');
const { getExpenseTotal } = require('../models/expenseModel');

const createOrUpdateBudget = async (req, res, next) => {
  try {
    const { tenDayLimit } = req.body;
    await setBudget({ userId: req.user.id, tenDayLimit });
    return res.json({ message: 'Budget saved' });
  } catch (error) {
    return next(error);
  }
};

const fetchBudget = async (req, res, next) => {
  try {
    const today = new Date();
    const to = today.toISOString().slice(0, 10);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const from = tenDaysAgo.toISOString().slice(0, 10);

    const budget = await getBudget(req.user.id);
    const totalExpense = await getExpenseTotal(req.user.id, from, to);
    const tenDayLimit = Number(budget?.ten_day_limit || 0);
    const usagePct = tenDayLimit > 0 ? (totalExpense / tenDayLimit) * 100 : 0;

    return res.json({
      tenDayLimit,
      totalExpense,
      usagePct,
      warning: usagePct >= 80,
      exceeded: usagePct >= 100,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createOrUpdateBudget, fetchBudget };
