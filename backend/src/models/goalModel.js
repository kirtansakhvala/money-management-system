const { pool } = require('../config/db');

const createGoal = async ({ userId, title, targetAmount, savedAmount }) => {
  const [result] = await pool.query(
    'INSERT INTO goals (user_id, title, target_amount, saved_amount) VALUES (?, ?, ?, ?)',
    [userId, title, targetAmount, savedAmount],
  );
  return result.insertId;
};

const updateGoal = async ({ userId, goalId, savedAmount }) => {
  const [result] = await pool.query('UPDATE goals SET saved_amount = ? WHERE id = ? AND user_id = ?', [savedAmount, goalId, userId]);
  return result.affectedRows > 0;
};

const getGoals = async (userId) => {
  const [rows] = await pool.query(
    'SELECT id, title, target_amount AS targetAmount, saved_amount AS savedAmount, created_at FROM goals WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
  );
  return rows;
};

module.exports = { createGoal, updateGoal, getGoals };
