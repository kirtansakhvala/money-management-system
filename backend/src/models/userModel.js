const { pool } = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const createUser = async ({ name, email, password }) => {
  const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
  return { id: result.insertId, name, email };
};

module.exports = { findUserByEmail, createUser };
