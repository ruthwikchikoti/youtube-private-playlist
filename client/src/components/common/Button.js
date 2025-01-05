import React from 'react';
import Loader from './Loader';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-500",
    outline: "border-2 border-gray-600 hover:bg-gray-700 text-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <Loader size="sm" className="mr-2" />
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
};

export default Button;