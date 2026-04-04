import React from 'react';

interface BrutalCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

const shadowMap = {
  sm: 'shadow-brutal-sm',
  md: 'shadow-brutal-md',
  lg: 'shadow-brutal-lg',
  xl: 'shadow-brutal-xl',
};

export function BrutalCard({
  title,
  children,
  className = '',
  shadow = 'md',
}: BrutalCardProps) {
  return (
    <div
      className={`
        border-3 border-stark-black
        bg-white
        p-6
        ${shadowMap[shadow]}
        ${className}
      `}
    >
      {title && (
        <h3 className="text-2xl font-bold mb-4 tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
