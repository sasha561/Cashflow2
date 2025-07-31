
import React from 'react';

interface InputProps {
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ id, name, value, onChange, type = 'text', placeholder = '', className = '', required = false }) => {
  return (
    <input
      id={id}
      name={name || id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition duration-200 ${className}`}
      onWheel={(e) => type === 'number' && (e.target as HTMLElement).blur()}
    />
  );
};

export default Input;
