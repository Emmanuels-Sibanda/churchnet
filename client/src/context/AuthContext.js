import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext useEffect running');
    try {
      const token = localStorage.getItem('token');
      const churchData = localStorage.getItem('church');
      if (token && churchData) {
        setUser(JSON.parse(churchData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('church');
    } finally {
      setLoading(false);
      console.log('AuthContext loading complete');
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, church } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('church', JSON.stringify(church));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(church);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (churchData) => {
    try {
      console.log('Registering with data:', { ...churchData, password: '***' });
      const response = await axios.post('/api/auth/register', churchData);
      const { token, church } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('church', JSON.stringify(church));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(church);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors from express-validator
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        return {
          success: false,
          error: errorMessages
        };
      }
      
      // Show detailed error message
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.message || 
                          'Registration failed';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('church');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

