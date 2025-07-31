
import React from 'react';
import Input from './Input';

interface LabeledInputProps {
  id: keyof import('../types').BudgetState;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  className?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({ id, label, ...props }) => {
  return (
    <div className={`flex items-center space-x-4 ${props.className}`}>
      <label htmlFor={id} className="w-1/2 text-sm font-semibold text-gray-600">
        {label}
      </label>
      <div className="w-1/2">
        <Input id={id} {...props} />
      </div>
    </div>
  );
};

export default LabeledInput;
