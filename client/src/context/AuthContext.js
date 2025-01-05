import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const userData = await authService.verifyToken();
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email) => {
    setError(null);
    try {
      await authService.sendOTP(email);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyOTP = async (email, otp) => {
    setError(null);
    try {
      const { token, user: userData } = await authService.verifyOTP(email, otp);
      localStorage.setItem('token', token);
      setUser(userData);
      navigate('/dashboard', { replace: true });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      verifyOTP,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};