const { pool } = require('../config/db');

const addIncome = async ({ userId, amount, source, date }) => {
  const [result] = await pool.query('INSERT INTO income (user_id, amount, source, date) VALUES (?, ?, ?, ?)', [userId, amount, source, date]);
  return result.insertId;
};

const getIncomeByUser = async ({ userId, limit, offset, from, to, search }) => {
  const filters = ['user_id = ?'];
  const values = [userId];

  if (from) {
    filters.push('date >= ?');
    values.push(from);
  }
  if (to) {
    filters.push('date <= ?');
    values.push(to);
  }
  if (search) {
    filters.push('source LIKE ?');
    values.push(`%${search}%`);
  }

  const whereClause = `WHERE ${filters.join(' AND ')}`;

  const [rows] = await pool.query(
    `SELECT id, amount, source, date, created_at
     FROM income ${whereClause}
     ORDER BY date DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset],
  );

  const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM income ${whereClause}`, values);
  return { rows, total: countResult[0].total };
};

const getIncomeTotal = async (userId) => {
  const [rows] = await pool.query('SELECT COALESCE(SUM(amount), 0) AS totalIncome FROM income WHERE user_id = ?', [userId]);
  return Number(rows[0].totalIncome || 0);
};

module.exports = { addIncome, getIncomeByUser, getIncomeTotal };
