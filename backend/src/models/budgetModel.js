const { pool } = require("../config/db")

let budgetColumnPromise

const usesTenDayBudgetColumn = async () => {
  if (!budgetColumnPromise) {
    budgetColumnPromise = pool
      .query("SHOW COLUMNS FROM budgets LIKE 'ten_day_limit'")
      .then(([rows]) => rows.length > 0)
      .catch(() => true)
  }
  return budgetColumnPromise
}

const setBudget = async ({ userId, tenDayLimit }) => {
  const hasTenDayLimit = await usesTenDayBudgetColumn()

  if (hasTenDayLimit) {
    await pool.query(
      `INSERT INTO budgets (user_id, ten_day_limit)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE ten_day_limit = VALUES(ten_day_limit)`,
      [userId, tenDayLimit]
    )
    return
  }

  await pool.query(
    `INSERT INTO budgets (user_id, monthly_limit)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE monthly_limit = VALUES(monthly_limit)`,
    [userId, tenDayLimit]
  )
}

const getBudget = async (userId) => {
  const hasTenDayLimit = await usesTenDayBudgetColumn()

  if (hasTenDayLimit) {
    const [rows] = await pool.query("SELECT ten_day_limit FROM budgets WHERE user_id = ?", [userId])
    return rows[0] || null
  }

  const [rows] = await pool.query("SELECT monthly_limit FROM budgets WHERE user_id = ?", [userId])
  if (!rows[0]) return null
  return { ten_day_limit: rows[0].monthly_limit }
}

module.exports = { setBudget, getBudget }
