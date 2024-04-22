import React from 'react';
import cl from 'classnames';

interface SelectProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  dataSource: string[];
  className?: string;
  isDisabledEmpty?: boolean;
  disabled?: boolean;
}

const Select = ({
  value,
  onChange,
  dataSource,
  className,
  isDisabledEmpty,
  disabled,
}: SelectProps) => {
  return (
    <select
      className={cl(
        'block border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white disabled:bg-gray-200',
        'notion-property-select',
        className
      )}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {!isDisabledEmpty && <option key="default" disabled></option>}
      {dataSource.map((item: string) => (
        <option value={item} key={item} className="notion-property-select-item">
          {item}
        </option>
      ))}
    </select>
  );
};

export default Select;
