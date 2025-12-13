import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-neon-orange hover:bg-warning-yellow text-stark-black',
  secondary: 'bg-stark-black hover:bg-neon-orange text-neon-orange hover:text-stark-black',
  tertiary: 'bg-white hover:bg-concrete text-stark-black',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const shadowStyles: Record<ButtonSize, string> = {
  sm: 'shadow-brutal-sm',
  md: 'shadow-brutal-md',
  lg: 'shadow-brutal-lg',
};

export function BrutalButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}: BrutalButtonProps) {
  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${shadowStyles[size]}
        border-3 border-stark-black
        font-bold
        font-mono
        btn-brutal
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
