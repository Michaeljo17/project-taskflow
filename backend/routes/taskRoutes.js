const express = require('express');
const {
  getAllTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask, 
  getTaskStats
} = require('../controllers/taskController');

const router = express.Router();

router.route('/tasks')
  .get(getAllTasks)
  .post(createTask);

router.route('/tasks/stats')
  .get(getTaskStats);

router.route('/tasks/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;