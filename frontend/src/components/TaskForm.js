import React, { useState } from 'react';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onTaskCreated(formData);
      setFormData({ title: '', description: '', priority: 'medium' });
    } catch (error) {
      // Error sudah ditangani di App.js, cukup log di sini
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</button>
      </form>
    </div>
  );
};

export default TaskForm;