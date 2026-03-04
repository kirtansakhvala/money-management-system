const { addIncome, getIncomeByUser } = require('../models/incomeModel');
const { getPagination } = require('../utils/pagination');

const createIncome = async (req, res, next) => {
  try {
    const { amount, source, date } = req.body;
    const id = await addIncome({ userId: req.user.id, amount, source, date });
    return res.status(201).json({ message: 'Income added', id });
  } catch (error) {
    return next(error);
  }
};

const getIncome = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { from, to, search } = req.query;
    const data = await getIncomeByUser({ userId: req.user.id, limit, offset, from, to, search });
    return res.json({ data: data.rows, page, limit, total: data.total });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createIncome, getIncome };
