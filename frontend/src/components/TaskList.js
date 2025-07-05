import React from 'react';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const handleStatusToggle = (task) => {
    onTaskUpdate(task.id, { status: task.status === 'pending' ? 'completed' : 'pending' });
  };

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Create your first task!</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className={`task-item ${task.status}`}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-meta">
              <span className={`priority ${task.priority}`}>{task.priority}</span>
              <div className="task-actions">
                <button onClick={() => handleStatusToggle(task)} className="btn-status">
                  {task.status === 'pending' ? 'Complete' : 'Reopen'}
                </button>
                <button onClick={() => onTaskDelete(task.id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;