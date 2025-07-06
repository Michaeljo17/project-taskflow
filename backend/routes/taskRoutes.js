const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // <-- 1. Impor 'protect'

// 2. Tambahkan 'protect' sebagai middleware di setiap rute
router.route('/')
  .get(protect, getAllTasks)
  .post(protect, createTask);

router.route('/stats')
  .get(protect, getTaskStats);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;