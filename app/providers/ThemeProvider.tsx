'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dim' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeStyles = {
  light: `
    html.light-theme {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f3c1;
      --text-primary: #000000;
      --text-secondary: #666666;
      --border-color: #000000;
      color-scheme: light;
    }
    html.light-theme body {
      background-color: #f5f3c1 !important;
      color: #000000 !important;
    }
    html.light-theme .bg-white { background-color: #ffffff !important; }
    html.light-theme .text-black { color: #000000 !important; }
    html.light-theme .text-white { color: #ffffff !important; }
    html.light-theme .bg-black { background-color: #000000 !important; }
    html.light-theme .bg-gray-50 { background-color: #f9fafb !important; }
    html.light-theme .border-black { border-color: #000000 !important; }
  `,
  dim: `
    html.dim-theme {
      --bg-primary: #1a1a1a;
      --bg-secondary: #2a2a2a;
      --text-primary: #e0e0e0;
      --text-secondary: #b0b0b0;
      --border-color: #4a4a4a;
      color-scheme: dark;
    }
    html.dim-theme body {
      background-color: #1a1a1a !important;
      color: #e0e0e0 !important;
    }
    html.dim-theme .bg-white { background-color: #2a2a2a !important; }
    html.dim-theme .text-black { color: #e0e0e0 !important; }
    html.dim-theme .text-white { color: #e0e0e0 !important; }
    html.dim-theme .bg-black { background-color: #1a1a1a !important; }
    html.dim-theme .bg-gray-50 { background-color: #252525 !important; }
    html.dim-theme .border-black { border-color: #4a4a4a !important; }
    html.dim-theme .bg-cream { background-color: #1a1a1a !important; }
    html.dim-theme .text-gray-700 { color: #b0b0b0 !important; }
    html.dim-theme .text-gray-600 { color: #a0a0a0 !important; }
  `,
  dark: `
    html.dark-theme {
      --bg-primary: #0a0a0a;
      --bg-secondary: #151515;
      --text-primary: #ffffff;
      --text-secondary: #d0d0d0;
      --border-color: #333333;
      color-scheme: dark;
    }
    html.dark-theme body {
      background-color: #0a0a0a !important;
      color: #ffffff !important;
    }
    html.dark-theme .bg-white { background-color: #0f0f0f !important; }
    html.dark-theme .text-black { color: #ffffff !important; }
    html.dark-theme .text-white { color: #ffffff !important; }
    html.dark-theme .bg-black { background-color: #000000 !important; }
    html.dark-theme .bg-gray-50 { background-color: #1a1a1a !important; }
    html.dark-theme .border-black { border-color: #333333 !important; }
    html.dark-theme .bg-cream { background-color: #0a0a0a !important; }
    html.dark-theme .text-gray-700 { color: #d0d0d0 !important; }
    html.dark-theme .text-gray-600 { color: #c0c0c0 !important; }
    html.dark-theme .shadow-brutal { box-shadow: 4px 4px 0px 0px rgba(255, 255, 255, 0.2) !important; }
  `
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem('theme') as Theme | null;
    const initialTheme = stored || 'light';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light-theme', 'dim-theme', 'dark-theme');
    
    // Add the new theme class
    root.classList.add(`${newTheme}-theme`);
    
    // Set data attribute
    root.setAttribute('data-theme', newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Inject theme styles on mount
  useEffect(() => {
    if (!mounted) return;
    
    let styleElement = document.getElementById('theme-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-styles';
      styleElement.innerHTML = Object.values(themeStyles).join('\n');
      document.head.appendChild(styleElement);
    }
  }, [mounted]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
