import React from 'react';

interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function BrutalInput({
  label,
  error,
  className = '',
  ...props
}: BrutalInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-bold text-sm tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          w-full
          border-3 border-stark-black
          px-4 py-3
          font-mono
          bg-white
          focus:outline-none
          focus:shadow-brutal-md
          transition-shadow
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${error ? 'border-neon-orange' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-neon-orange font-bold">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
