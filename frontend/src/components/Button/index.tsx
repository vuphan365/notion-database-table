import cl from 'classnames';
import React from 'react';

interface ButtonProps extends React.PropsWithChildren {
  variant: 'danger' | 'primary';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
}

const Button = ({
  variant,
  onClick,
  disabled,
  children,
  type,
  className,
}: ButtonProps) => (
  <button
    className={cl(
      ' px-4 py-1 rounded text-white disabled:bg-blue-100',
      { 'bg-blue-600  disabled:bg-blue-100': variant === 'primary' },
      { 'bg-red-500  disabled:bg-red-100': variant === 'danger' },
      className
    )}
    onClick={onClick}
    type={type}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
