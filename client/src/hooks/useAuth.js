import { useState, useEffect, useContext, createContext } from 'react';
import api from '../services/api';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = storage.get('user');
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
    console.log('AuthProvider initialized, user:', storedUser);
  }, []);

  const login = async (email) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  };

  const verifyOTP = async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    const userData = response.data;
    setUser(userData);
    storage.set('user', userData);
    console.log('OTP verified, user:', userData);
    return userData;
  };

  const logout = (navigate) => {
    setUser(null);
    storage.remove('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
