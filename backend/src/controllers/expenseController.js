const { addExpense, getExpensesByUser, removeExpense } = require("../models/expenseModel")
const { getPagination } = require("../utils/pagination")

const createExpense = async (req, res, next) => {
  try {
    const { amount, category, note, date } = req.body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
    const id = await addExpense({ userId: req.user.id, amount, category, note, date, imageUrl })
    return res.status(201).json({ message: "Expense added", id, imageUrl })
  } catch (error) {
    return next(error)
  }
}

const getExpenses = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query)
    const { from, to, category, search } = req.query
    const data = await getExpensesByUser({
      userId: req.user.id,
      limit,
      offset,
      from,
      to,
      category,
      search,
    })
    return res.json({ data: data.rows, page, limit, total: data.total })
  } catch (error) {
    return next(error)
  }
}

const deleteExpense = async (req, res, next) => {
  try {
    const deleted = await removeExpense({ userId: req.user.id, expenseId: req.params.id })
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" })
    }
    return res.json({ message: "Expense deleted" })
  } catch (error) {
    return next(error)
  }
}

module.exports = { createExpense, getExpenses, deleteExpense }
