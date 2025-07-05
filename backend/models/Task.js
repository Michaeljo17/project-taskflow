const { pool } = require('../config/database');

class Task {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM tasks ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(taskData) {
    const { title, description, priority } = taskData;
    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
      [title, description, priority || 'medium']
    );
    return this.findById(result.insertId);
  }

  static async update(id, taskData) {
    const fields = Object.keys(taskData).map(key => `${key} = ?`);
    const values = [...Object.values(taskData), id];
    
    if (fields.length === 0) throw new Error('No fields to update');
    
    await pool.execute(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id) {
    const task = await this.findById(id);
    if (!task) throw new Error('Task not found');
    
    await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return { message: 'Task deleted successfully' };
  }

  static async getStats() {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM tasks');
    const [[{ completed }]] = await pool.execute('SELECT COUNT(*) as completed FROM tasks WHERE status = "completed"');
    const [[{ pending }]] = await pool.execute('SELECT COUNT(*) as pending FROM tasks WHERE status = "pending"');
    const [[{ highPriority }]] = await pool.execute('SELECT COUNT(*) as highPriority FROM tasks WHERE priority = "high"');
    
    return { total, completed, pending, highPriority };
  }
}

module.exports = Task;