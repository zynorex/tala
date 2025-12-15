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
    <div className="flex items-center gap-2 border-4 border-black bg-white p-1 rounded-lg shadow-brutal" style={{
      backgroundColor: 'var(--card-bg)',
      borderColor: 'var(--border-color)',
    }}>
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded transition-all ${
          theme === 'light'
            ? 'bg-heirlock-yellow text-black shadow-brutal'
            : 'text-gray-500 hover:text-black'
        }`}
        title="Light Mode"
        style={{
          color: theme === 'light' ? '#000' : 'var(--text-secondary)',
        }}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dim')}
        className={`p-2 rounded transition-all ${
          theme === 'dim'
            ? 'bg-heirlock-green text-black shadow-brutal'
            : 'text-gray-500 hover:text-black'
        }`}
        title="Dim Mode"
        style={{
          color: theme === 'dim' ? '#000' : 'var(--text-secondary)',
        }}
      >
        <Zap className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded transition-all ${
          theme === 'dark'
            ? 'bg-heirlock-pink text-black shadow-brutal'
            : 'text-gray-500 hover:text-black'
        }`}
        title="Dark Mode"
        style={{
          color: theme === 'dark' ? '#000' : 'var(--text-secondary)',
        }}
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
