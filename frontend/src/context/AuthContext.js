import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const register = async (userData) => {
    try {
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const login = async (userData) => {
    try {
      const loggedInUser = await authService.login(userData);
      setUser(loggedInUser);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  // Fungsi logout yang benar
  const logout = () => {
    authService.logout(); // Hapus dari localStorage
    setUser(null); // Hapus state user
    navigate('/login'); // Arahkan ke halaman login
  };

  const updateUsername = async (usernameData) => {
    try {
      const response = await authService.updateUsername(usernameData);
      setUser(response.data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = { user, register, login, logout, updateUsername };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};