const { pool } = require('../config/database');

class Task {
  static async findAllByUser(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async findByIdAndUser(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  }

  static async create(taskData) {
    const { title, description, priority, user_id } = taskData;
    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description, priority, user_id) VALUES (?, ?, ?, ?)',
      [title, description || null, priority || 'medium', user_id]
    );
    return this.findByIdAndUser(result.insertId, user_id);
  }

  static async update(id, taskData) {
    const fields = Object.keys(taskData).map(key => `${key} = ?`);
    const values = [...Object.values(taskData), id];

    await pool.execute(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return true;
  }

  static async getStatsByUser(userId) {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM tasks WHERE user_id = ?', [userId]);
    const [[{ completed }]] = await pool.execute('SELECT COUNT(*) as completed FROM tasks WHERE status = "completed" AND user_id = ?', [userId]);
    const [[{ pending }]] = await pool.execute('SELECT COUNT(*) as pending FROM tasks WHERE status = "pending" AND user_id = ?', [userId]);
    const [[{ highPriority }]] = await pool.execute('SELECT COUNT(*) as highPriority FROM tasks WHERE priority = "high" AND user_id = ?', [userId]);

    return { total, completed, pending, highPriority };
  }
}

module.exports = Task;