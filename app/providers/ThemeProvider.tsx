'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dim' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeStyles = `
/* LIGHT MODE */
html.light-theme { --bg-primary: #ffffff; --bg-secondary: #f5f3c1; --text-primary: #000000; --text-secondary: #666666; --border-color: #000000; color-scheme: light; }
html.light-theme body { background-color: #f5f3c1 !important; color: #000000 !important; }
html.light-theme .bg-white { background-color: #ffffff !important; }
html.light-theme .bg-cream { background-color: #f5f3c1 !important; }
html.light-theme .bg-black { background-color: #000000 !important; }
html.light-theme .bg-gray-50 { background-color: #f9fafb !important; }
html.light-theme .bg-gray-100 { background-color: #f3f4f6 !important; }
html.light-theme .bg-gray-900 { background-color: #111827 !important; }
html.light-theme .bg-blue-50 { background-color: #eff6ff !important; }
html.light-theme .bg-green-50 { background-color: #f0fdf4 !important; }
html.light-theme .bg-pink-50 { background-color: #fdf2f8 !important; }
html.light-theme .bg-yellow-50 { background-color: #fefce8 !important; }
html.light-theme .bg-purple-50 { background-color: #faf5ff !important; }
html.light-theme .bg-orange-500 { background-color: #f97316 !important; }
html.light-theme .text-black { color: #000000 !important; }
html.light-theme .text-white { color: #ffffff !important; }
html.light-theme .text-gray-700 { color: #374151 !important; }
html.light-theme .text-gray-600 { color: #4b5563 !important; }
html.light-theme .text-gray-500 { color: #6b7280 !important; }
html.light-theme .text-gray-400 { color: #9ca3af !important; }
html.light-theme .text-gray-300 { color: #d1d5db !important; }
html.light-theme .border-black { border-color: #000000 !important; }
html.light-theme .border-gray-400 { border-color: #9ca3af !important; }
html.light-theme .border-gray-300 { border-color: #d1d5db !important; }

/* DIM MODE */
html.dim-theme { --bg-primary: #1a1a1a; --bg-secondary: #2a2a2a; --text-primary: #e0e0e0; --text-secondary: #b0b0b0; --border-color: #4a4a4a; color-scheme: dark; }
html.dim-theme body { background-color: #1a1a1a !important; color: #e0e0e0 !important; }
html.dim-theme .bg-white { background-color: #252525 !important; }
html.dim-theme .bg-cream { background-color: #1a1a1a !important; }
html.dim-theme .bg-black { background-color: #0f0f0f !important; }
html.dim-theme .bg-gray-50 { background-color: #2a2a2a !important; }
html.dim-theme .bg-gray-100 { background-color: #303030 !important; }
html.dim-theme .bg-gray-900 { background-color: #1a1a1a !important; }
html.dim-theme .bg-blue-50 { background-color: #1e3a5f !important; }
html.dim-theme .bg-green-50 { background-color: #1a3a2a !important; }
html.dim-theme .bg-pink-50 { background-color: #3a1f2a !important; }
html.dim-theme .bg-yellow-50 { background-color: #3a3a1a !important; }
html.dim-theme .bg-purple-50 { background-color: #2a1a3a !important; }
html.dim-theme .bg-orange-500 { background-color: #c55a11 !important; }
html.dim-theme .text-black { color: #e0e0e0 !important; }
html.dim-theme .text-white { color: #e0e0e0 !important; }
html.dim-theme .text-gray-700 { color: #c0c0c0 !important; }
html.dim-theme .text-gray-600 { color: #b0b0b0 !important; }
html.dim-theme .text-gray-500 { color: #a0a0a0 !important; }
html.dim-theme .text-gray-400 { color: #808080 !important; }
html.dim-theme .text-gray-300 { color: #606060 !important; }
html.dim-theme .border-black { border-color: #4a4a4a !important; }
html.dim-theme .border-gray-400 { border-color: #505050 !important; }
html.dim-theme .border-gray-300 { border-color: #404040 !important; }
html.dim-theme .shadow-brutal { box-shadow: 4px 4px 0px 0px rgba(200, 200, 200, 0.1) !important; }
html.dim-theme .shadow-card { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important; }
html.dim-theme .hover\:bg-gray-50:hover { background-color: #303030 !important; }
html.dim-theme .hover\:shadow-brutal:hover { box-shadow: 4px 4px 0px 0px rgba(200, 200, 200, 0.1) !important; }
html.dim-theme .bg-heirlock-yellow { background-color: #3a3a1a !important; }
html.dim-theme .bg-heirlock-green { background-color: #1a3a2a !important; }
html.dim-theme .bg-heirlock-pink { background-color: #3a1f2a !important; }
html.dim-theme .bg-heirlock-blue { background-color: #1e3a5f !important; }
html.dim-theme .border-heirlock-yellow { border-color: #d4af37 !important; }
html.dim-theme .border-heirlock-green { border-color: #7ec850 !important; }
html.dim-theme .border-heirlock-pink { border-color: #ff9aa2 !important; }
html.dim-theme .border-heirlock-blue { border-color: #8db8e8 !important; }

/* DARK MODE */
html.dark-theme { --bg-primary: #0a0a0a; --bg-secondary: #151515; --text-primary: #ffffff; --text-secondary: #d0d0d0; --border-color: #333333; color-scheme: dark; }
html.dark-theme body { background-color: #0a0a0a !important; color: #ffffff !important; }
html.dark-theme .bg-white { background-color: #1a1a1a !important; }
html.dark-theme .bg-cream { background-color: #0a0a0a !important; }
html.dark-theme .bg-black { background-color: #000000 !important; }
html.dark-theme .bg-gray-50 { background-color: #1f1f1f !important; }
html.dark-theme .bg-gray-100 { background-color: #252525 !important; }
html.dark-theme .bg-gray-900 { background-color: #0a0a0a !important; }
html.dark-theme .bg-blue-50 { background-color: #0d1f3c !important; }
html.dark-theme .bg-green-50 { background-color: #0d2818 !important; }
html.dark-theme .bg-pink-50 { background-color: #2a0f1f !important; }
html.dark-theme .bg-yellow-50 { background-color: #2a2a0d !important; }
html.dark-theme .bg-purple-50 { background-color: #1a0d2a !important; }
html.dark-theme .bg-orange-500 { background-color: #8b3a0d !important; }
html.dark-theme .text-black { color: #ffffff !important; }
html.dark-theme .text-white { color: #ffffff !important; }
html.dark-theme .text-gray-700 { color: #e0e0e0 !important; }
html.dark-theme .text-gray-600 { color: #d0d0d0 !important; }
html.dark-theme .text-gray-500 { color: #b0b0b0 !important; }
html.dark-theme .text-gray-400 { color: #808080 !important; }
html.dark-theme .text-gray-300 { color: #505050 !important; }
html.dark-theme .border-black { border-color: #333333 !important; }
html.dark-theme .border-gray-400 { border-color: #404040 !important; }
html.dark-theme .border-gray-300 { border-color: #303030 !important; }
html.dark-theme .shadow-brutal { box-shadow: 4px 4px 0px 0px rgba(255, 255, 255, 0.1) !important; }
html.dark-theme .shadow-card { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6) !important; }
html.dark-theme .hover\:bg-gray-50:hover { background-color: #252525 !important; }
html.dark-theme .hover\:shadow-brutal:hover { box-shadow: 4px 4px 0px 0px rgba(255, 255, 255, 0.1) !important; }
html.dark-theme .bg-heirlock-yellow { background-color: #2a2a0d !important; }
html.dark-theme .bg-heirlock-green { background-color: #0d2818 !important; }
html.dark-theme .bg-heirlock-pink { background-color: #2a0f1f !important; }
html.dark-theme .bg-heirlock-blue { background-color: #0d1f3c !important; }
html.dark-theme .border-heirlock-yellow { border-color: #d4af37 !important; }
html.dark-theme .border-heirlock-green { border-color: #7ec850 !important; }
html.dark-theme .border-heirlock-pink { border-color: #ff6b7a !important; }
html.dark-theme .border-heirlock-blue { border-color: #6ba3d9 !important; }
`;

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
      styleElement.innerHTML = themeStyles;
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
