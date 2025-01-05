import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import OtpInput from './OtpInput';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, verifyOTP, error } = useAuth();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      setIsOtpSent(true);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);
    try {
      await verifyOTP(email, otp);
    } catch (err) {
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
      {!isOtpSent ? (
        <form onSubmit={handleEmailSubmit}>
          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Button
            type="submit"
            className="w-full mt-6"
            loading={loading}
          >
            Continue with Email
          </Button>
        </form>
      ) : (
        <OtpInput onSubmit={handleOtpSubmit} loading={loading} />
      )}
      
      {error && (
        <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
};

export default LoginForm;