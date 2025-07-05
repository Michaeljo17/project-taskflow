import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskAPI } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const displayMessage = (setter, message) => {
    setter(message);
    setTimeout(() => setter(''), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const [tasksResponse, statsResponse] = await Promise.all([
        taskAPI.getTasks(),
        taskAPI.getStats(),
      ]);
      setTasks(tasksResponse.data || []);
      setStats(statsResponse.data || { total: 0, completed: 0, pending: 0, highPriority: 0 });
    } catch (err) {
      displayMessage(setError, err.message);
    }
  }, []);

  const initializeApp = useCallback(async () => {
    setLoading(true);
    try {
      await taskAPI.healthCheck();
      await loadData();
    } catch (err) {
      setError('Failed to connect to backend. Please ensure XAMPP/MySQL and backend server are running.');
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handleTaskAction = async (action, successMsg, ...args) => {
    try {
      await action(...args);
      await loadData();
      displayMessage(setSuccess, successMsg);
    } catch (err) {
      displayMessage(setError, err.message);
      throw err;
    }
  };

  const handleTaskCreated = (data) => handleTaskAction(taskAPI.createTask, 'Task created successfully!', data);
  const handleTaskUpdate = (id, data) => handleTaskAction(taskAPI.updateTask, 'Task updated successfully!', id, data);
  const handleTaskDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      handleTaskAction(taskAPI.deleteTask, 'Task deleted successfully!', id);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TaskFlow</h1>
        <p>Full Stack Task Management App</p>
      </header>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <div className="stats-container">
        <div className="stat-card"><h3>{stats.total}</h3><p>Total Tasks</p></div>
        <div className="stat-card"><h3>{stats.completed}</h3><p>Completed</p></div>
        <div className="stat-card"><h3>{stats.pending}</h3><p>Pending</p></div>
        <div className="stat-card"><h3>{stats.highPriority}</h3><p>High Priority</p></div>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <TaskForm onTaskCreated={handleTaskCreated} />
        </div>
        <div className="right-panel">
          {loading && !tasks.length ? (
            <div className="loading">Loading...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;