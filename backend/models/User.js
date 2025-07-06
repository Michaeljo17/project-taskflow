const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async create(userData) {
    const { username, password } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return { id: result.insertId, username };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updatePassword(id, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return { success: true, message: 'Password updated successfully' };
  }

  // --- FUNGSI BARU ---
  static async updateUsername(id, newUsername) {
    await pool.execute(
      'UPDATE users SET username = ? WHERE id = ?',
      [newUsername, id]
    );
    return { success: true, message: 'Username updated successfully' };
  }
}

module.exports = User;