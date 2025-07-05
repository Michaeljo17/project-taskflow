import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export const taskAPI = {
  healthCheck: () => api.get('/health'),
  getTasks: () => api.get('/tasks'),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats')
};