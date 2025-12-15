'use client';

import { useTheme } from '@/app/providers/ThemeProvider';
import { Sun, Moon, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 border-4 border-black bg-white py-2 px-1.5 shadow-brutal" style={{
      backgroundColor: 'var(--card-bg)',
      borderColor: 'var(--border-color)',
      height: '48px',
      minHeight: '48px',
    }}>
      <button
        onClick={() => setTheme('light')}
        className={`p-2.5 rounded transition-all flex items-center justify-center ${
          theme === 'light'
            ? 'bg-heirlock-yellow text-black shadow-brutal'
            : 'text-gray-500 hover:text-black'
        }`}
        title="Light Mode"
        style={{
          color: theme === 'light' ? '#000' : 'var(--text-secondary)',
          width: '40px',
          height: '40px',
        }}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dim')}
        className={`p-2.5 rounded transition-all flex items-center justify-center ${
          theme === 'dim'
            ? 'bg-heirlock-green text-black shadow-brutal'
            : 'text-gray-500 hover:text-black'
        }`}
        title="Dim Mode"
        style={{
          color: theme === 'dim' ? '#000' : 'var(--text-secondary)',
          width: '40px',
          height: '40px',
        }}
      >
        <Zap className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2.5 rounded transition-all flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-heirlock-pink text-black shadow-brutal'
            : 'text-gray-500 hover:text-black'
        }`}
        title="Dark Mode"
        style={{
          color: theme === 'dark' ? '#000' : 'var(--text-secondary)',
          width: '40px',
          height: '40px',
        }}
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
