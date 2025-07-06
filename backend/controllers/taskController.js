const Task = require('../models/Task');

// Dapatkan semua tugas milik pengguna yang login
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAllByUser(req.user.id);
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve tasks' });
  }
};

// Dapatkan satu tugas (dengan validasi pemilik)
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUser(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found or not authorized' });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve task' });
    }
};

// Buat tugas baru
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const taskData = { title, description, priority, user_id: req.user.id };
    const task = await Task.create(taskData);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
};

// Update tugas (dengan validasi pemilik)
exports.updateTask = async (req, res) => {
    try {
        // Pertama, pastikan tugas itu ada dan milik user yang benar
        let task = await Task.findByIdAndUser(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found or not authorized' });
        }

        // Lakukan update
        const updatedTask = await Task.update(req.params.id, req.body);
        res.json({ success: true, data: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update task' });
    }
};

// Hapus tugas (dengan validasi pemilik)
exports.deleteTask = async (req, res) => {
    try {
        // Pertama, pastikan tugas itu ada dan milik user yang benar
        let task = await Task.findByIdAndUser(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found or not authorized' });
        }

        await Task.delete(req.params.id);
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete task' });
    }
};

// Dapatkan statistik tugas milik pengguna yang login
exports.getTaskStats = async (req, res) => {
    try {
        const stats = await Task.getStatsByUser(req.user.id);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve stats' });
    }
};