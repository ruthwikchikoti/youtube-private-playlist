import api from './api';

export const sendOTP = async (email) => {
  try {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid OTP');
  }
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data.data;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
