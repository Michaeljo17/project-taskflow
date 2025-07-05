const Task = require('../models/Task');

const handleRequest = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(`Error in ${req.path}:`, error);
    res.status(500).json({ success: false, error: error.message || 'Server Error' });
  }
};

exports.getAllTasks = handleRequest(async (req, res) => {
  const tasks = await Task.findAll();
  res.json({ success: true, count: tasks.length, data: tasks });
});

exports.getTask = handleRequest(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
  res.json({ success: true, data: task });
});

exports.createTask = handleRequest(async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'Title is required' });
  
  const task = await Task.create(req.body);
  res.status(201).json({ success: true, data: task });
});

exports.updateTask = handleRequest(async (req, res) => {
  const task = await Task.update(req.params.id, req.body);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
  res.json({ success: true, data: task });
});

exports.deleteTask = handleRequest(async (req, res) => {
  const result = await Task.delete(req.params.id);
  res.json({ success: true, data: result });
});

exports.getTaskStats = handleRequest(async (req, res) => {
  const stats = await Task.getStats();
  res.json({ success: true, data: stats });
});