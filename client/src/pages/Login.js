import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#1a1d24] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/api/placeholder/150/40" 
            alt="Logo"
            className="mx-auto h-12 mb-8"
          />
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;