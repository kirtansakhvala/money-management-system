const { pool } = require("../config/db")

let imageUrlColumnPromise

const hasImageUrlColumn = async () => {
  if (!imageUrlColumnPromise) {
    imageUrlColumnPromise = pool
      .query("SHOW COLUMNS FROM expenses LIKE 'image_url'")
      .then(([rows]) => rows.length > 0)
      .catch(() => true)
  }
  return imageUrlColumnPromise
}

const addExpense = async ({ userId, amount, category, note, date, imageUrl }) => {
  const imageColumnExists = await hasImageUrlColumn()

  if (!imageColumnExists) {
    const [result] = await pool.query(
      "INSERT INTO expenses (user_id, amount, category, note, date) VALUES (?, ?, ?, ?, ?)",
      [userId, amount, category, note, date]
    )
    return result.insertId
  }

  const [result] = await pool.query(
    "INSERT INTO expenses (user_id, amount, category, note, date, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, amount, category, note, date, imageUrl || null]
  )
  return result.insertId
}

const getExpensesByUser = async ({ userId, limit, offset, from, to, category, search }) => {
  const imageColumnExists = await hasImageUrlColumn()
  const filters = ["user_id = ?"]
  const values = [userId]

  if (from) {
    filters.push("date >= ?")
    values.push(from)
  }
  if (to) {
    filters.push("date <= ?")
    values.push(to)
  }
  if (category) {
    filters.push("category = ?")
    values.push(category)
  }
  if (search) {
    filters.push("(note LIKE ? OR category LIKE ?)")
    values.push(`%${search}%`, `%${search}%`)
  }

  const whereClause = `WHERE ${filters.join(" AND ")}`
  const imageSelect = imageColumnExists ? "image_url" : "NULL AS image_url"

  const [rows] = await pool.query(
    `SELECT id, amount, category, note, date, ${imageSelect}, created_at
     FROM expenses ${whereClause}
     ORDER BY date DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  )

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM expenses ${whereClause}`,
    values
  )
  return { rows, total: countResult[0].total }
}

const removeExpense = async ({ userId, expenseId }) => {
  const [result] = await pool.query(
    "DELETE FROM expenses WHERE id = ? AND user_id = ?",
    [expenseId, userId]
  )
  return result.affectedRows > 0
}

const getExpenseTotal = async (userId, from = null, to = null) => {
  let query = "SELECT COALESCE(SUM(amount), 0) AS totalExpense FROM expenses WHERE user_id = ?"
  const values = [userId]

  if (from && to) {
    query += " AND date >= ? AND date <= ?"
    values.push(from, to)
  }

  const [rows] = await pool.query(query, values)
  return Number(rows[0].totalExpense || 0)
}

const getCategorySummary = async (userId, from = null, to = null) => {
  let query = `SELECT category, COALESCE(SUM(amount), 0) AS total
     FROM expenses
     WHERE user_id = ?`
  const values = [userId]

  if (from && to) {
    query += " AND date >= ? AND date <= ?"
    values.push(from, to)
  }

  query += " GROUP BY category ORDER BY total DESC"

  const [rows] = await pool.query(query, values)
  return rows
}

const getDateWiseSummary = async (userId, from = null, to = null) => {
  let query = `SELECT date, COALESCE(SUM(amount), 0) AS total
     FROM expenses
     WHERE user_id = ?`
  const values = [userId]

  if (from && to) {
    query += " AND date >= ? AND date <= ?"
    values.push(from, to)
  }

  query += " GROUP BY date ORDER BY date DESC"

  const [rows] = await pool.query(query, values)
  return rows
}

const getTodayExpense = async (userId, today) => {
  const imageColumnExists = await hasImageUrlColumn()
  const imageSelect = imageColumnExists ? "image_url" : "NULL AS image_url"

  const [rows] = await pool.query(
    `SELECT id, amount, category, note, ${imageSelect}, date
     FROM expenses
     WHERE user_id = ? AND date = ?
     ORDER BY id DESC`,
    [userId, today]
  )
  return rows
}

module.exports = {
  addExpense,
  getExpensesByUser,
  removeExpense,
  getExpenseTotal,
  getCategorySummary,
  getDateWiseSummary,
  getTodayExpense,
}
