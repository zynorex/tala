import { ReactNode } from 'react';
import { useScrollFadeIn } from '@/app/hooks/useScrollFadeIn';

interface ScrollFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export default function ScrollFadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollFadeInProps) {
  const ref = useScrollFadeIn();

  const directionClass = {
    up: 'scroll-fade',
    left: 'scroll-fade animate-slideInLeft',
    right: 'scroll-fade animate-slideInRight',
  }[direction];

  return (
    <div
      ref={ref}
      className={`${directionClass} ${className}`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      {children}
    </div>
  );
}

