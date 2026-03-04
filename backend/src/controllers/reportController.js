const { getIncomeTotal } = require('../models/incomeModel');
const { getExpenseTotal, getCategorySummary, getDateWiseSummary, getTodayExpense, getExpensesByUser } = require('../models/expenseModel');
const { getBudget } = require('../models/budgetModel');

const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const mode = req.query.mode || 'total'; // 'total' or '10day'
    let from = null;
    let to = null;

    if (mode === '10day') {
      const today = new Date();
      to = today.toISOString().slice(0, 10);
      const tenDaysAgo = new Date(today);
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      from = tenDaysAgo.toISOString().slice(0, 10);
    }

    const today = new Date().toISOString().slice(0, 10);
    const [totalIncome, totalExpense, budget, recentExpenses, todayExpenses] = await Promise.all([
      getIncomeTotal(userId),
      getExpenseTotal(userId, from, to),
      getBudget(userId),
      getExpensesByUser({ userId, limit: 5, offset: 0, from, to }),
      getTodayExpense(userId, today),
    ]);

    const tenDayLimit = Number(budget?.ten_day_limit || 0);
    const usagePct = tenDayLimit > 0 ? (totalExpense / tenDayLimit) * 100 : 0;
    const todayExpenseTotal = todayExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    return res.json({
      mode,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      todayExpense: todayExpenseTotal,
      budget: {
        tenDayLimit,
        usagePct,
        warning: usagePct >= 80,
      },
      recentTransactions: recentExpenses.rows,
    });
  } catch (error) {
    return next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;
    const [categories, dateWise] = await Promise.all([
      getCategorySummary(userId, from, to),
      getDateWiseSummary(userId, from, to),
    ]);
    return res.json({ categories, dateWise });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDashboardSummary, getAnalytics };
