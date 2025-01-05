import React from 'react';

const Input = ({
  type = 'text',
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-4 py-2 bg-gray-800 border rounded-lg 
          ${error ? 'border-red-500' : 'border-gray-700'}
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
