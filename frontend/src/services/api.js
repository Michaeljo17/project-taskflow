import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Interceptor untuk menyisipkan token secara otomatis
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export const taskAPI = {
  // Auth
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  updateUsername: (usernameData) => api.put('/auth/updateusername', usernameData), // <-- BARIS INI KEMUNGKINAN HILANG

  // Tasks
  getTasks: () => api.get('/tasks'),
  getStats: () => api.get('/tasks/stats'),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};