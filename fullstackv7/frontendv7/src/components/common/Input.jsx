// src/components/common/Input.jsx
import React from 'react';

const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};

export default Input;
