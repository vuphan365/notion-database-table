import React from 'react';
import cl from 'classnames';
interface InputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  testid?: string;
}

const Input = ({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  testid,
}: InputProps) => {
  return (
    <input
      data-testid={testid}
      type="text"
      className={cl(
        'border w-[150px] border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:bg-gray-200',
        className
      )}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default Input;
