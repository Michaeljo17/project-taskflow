import { taskAPI } from './api';

// Register user
const register = async (userData) => {
  const response = await taskAPI.register(userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await taskAPI.login(userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Update password
const updatePassword = async (passwordData) => {
  const response = await taskAPI.updatePassword(passwordData);
  return response;
};

// -- FUNGSI BARU --
const updateUsername = async (usernameData) => {
  const response = await taskAPI.updateUsername(usernameData);
  if (response.data) {
    // Perbarui data user di localStorage dengan data & token baru dari backend
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response;
};

const authService = {
  register,
  login,
  logout,
  updatePassword,
  updateUsername, // <-- Tambahkan ini
};

export default authService;