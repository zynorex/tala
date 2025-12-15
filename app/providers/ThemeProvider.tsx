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

/* DIM MODE - ENTERPRISE GRADE */
html.dim-theme { 
  --bg-primary: #0f1419; 
  --bg-secondary: #1a1f2e; 
  --text-primary: #e4e9f1; 
  --text-secondary: #a8b2c1; 
  --border-color: #2d3748;
  --accent-blue: #3b82f6;
  --accent-purple: #a78bfa;
  --accent-cyan: #06b6d4;
  --accent-green: #10b981;
  color-scheme: dark; 
}
html.dim-theme body { 
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%) !important; 
  color: #e4e9f1 !important; 
}
html.dim-theme .bg-white { background-color: #1a1f2e !important; border-color: #2d3748 !important; }
html.dim-theme .bg-cream { background-color: #0f1419 !important; }
html.dim-theme .bg-black { background-color: #000000 !important; }
html.dim-theme .bg-gray-50 { background: linear-gradient(135deg, #1a1f2e 0%, #252d3d 100%) !important; }
html.dim-theme .bg-gray-100 { background-color: #252d3d !important; }
html.dim-theme .bg-gray-900 { background-color: #0f1419 !important; }
html.dim-theme .bg-blue-50 { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important; }
html.dim-theme .bg-green-50 { background: linear-gradient(135deg, #065f46 0%, #047857 100%) !important; }
html.dim-theme .bg-pink-50 { background: linear-gradient(135deg, #831843 0%, #9f1239 100%) !important; }
html.dim-theme .bg-yellow-50 { background: linear-gradient(135deg, #78350f 0%, #92400e 100%) !important; }
html.dim-theme .bg-purple-50 { background: linear-gradient(135deg, #5b21b6 0%, #6d28d9 100%) !important; }
html.dim-theme .bg-orange-500 { background-color: #d97706 !important; }
html.dim-theme .text-black { color: #e4e9f1 !important; }
html.dim-theme .text-white { color: #f8fafc !important; }
html.dim-theme .text-gray-700 { color: #cbd5e1 !important; }
html.dim-theme .text-gray-600 { color: #b0b9c9 !important; }
html.dim-theme .text-gray-500 { color: #8fa3b0 !important; }
html.dim-theme .text-gray-400 { color: #6b7684 !important; }
html.dim-theme .text-gray-300 { color: #4a5568 !important; }
html.dim-theme .border-black { border-color: #2d3748 !important; }
html.dim-theme .border-gray-400 { border-color: #3a4556 !important; }
html.dim-theme .border-gray-300 { border-color: #2d3748 !important; }
html.dim-theme .shadow-brutal { box-shadow: 4px 4px 0px 0px rgba(139, 92, 246, 0.15) !important; }
html.dim-theme .shadow-card { box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1), 0 0 1px rgba(59, 130, 246, 0.2) !important; }
html.dim-theme .hover\:bg-gray-50:hover { background: linear-gradient(135deg, #252d3d 0%, #2d3748 100%) !important; }
html.dim-theme .hover\:shadow-brutal:hover { box-shadow: 4px 4px 0px 0px rgba(139, 92, 246, 0.25) !important; }
html.dim-theme .bg-heirlock-yellow { background: linear-gradient(135deg, #78350f 0%, #92400e 100%) !important; }
html.dim-theme .bg-heirlock-green { background: linear-gradient(135deg, #065f46 0%, #047857 100%) !important; }
html.dim-theme .bg-heirlock-pink { background: linear-gradient(135deg, #831843 0%, #9f1239 100%) !important; }
html.dim-theme .bg-heirlock-blue { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important; }
html.dim-theme .border-heirlock-yellow { border-color: #fbbf24 !important; }
html.dim-theme .border-heirlock-green { border-color: #34d399 !important; }
html.dim-theme .border-heirlock-pink { border-color: #f472b6 !important; }
html.dim-theme .border-heirlock-blue { border-color: #60a5fa !important; }
html.dim-theme h1, html.dim-theme h2, html.dim-theme h3 { color: #f8fafc !important; }
html.dim-theme .font-black { color: #f8fafc !important; }

/* DARK MODE - ENTERPRISE GRADE */
html.dark-theme { 
  --bg-primary: #050810; 
  --bg-secondary: #0f1419; 
  --text-primary: #f0f4f8; 
  --text-secondary: #cbd5e1;
  --border-color: #1e293b;
  --accent-blue: #3b82f6;
  --accent-purple: #a78bfa;
  --accent-cyan: #06b6d4;
  --accent-green: #10b981;
  color-scheme: dark; 
}
html.dark-theme body { 
  background: linear-gradient(135deg, #050810 0%, #0f1419 50%, #1a1f2e 100%) !important; 
  color: #f0f4f8 !important; 
}
html.dark-theme .bg-white { background-color: #0f1419 !important; border-color: #1e293b !important; }
html.dark-theme .bg-cream { background-color: #050810 !important; }
html.dark-theme .bg-black { background-color: #000000 !important; }
html.dark-theme .bg-gray-50 { background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%) !important; }
html.dark-theme .bg-gray-100 { background-color: #1a1f2e !important; }
html.dark-theme .bg-gray-900 { background-color: #050810 !important; }
html.dark-theme .bg-blue-50 { background: linear-gradient(135deg, #0c2d6b 0%, #1e40af 100%) !important; }
html.dark-theme .bg-green-50 { background: linear-gradient(135deg, #064e3b 0%, #047857 100%) !important; }
html.dark-theme .bg-pink-50 { background: linear-gradient(135deg, #801336 0%, #be185d 100%) !important; }
html.dark-theme .bg-yellow-50 { background: linear-gradient(135deg, #65350f 0%, #92400e 100%) !important; }
html.dark-theme .bg-purple-50 { background: linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%) !important; }
html.dark-theme .bg-orange-500 { background-color: #b45309 !important; }
html.dark-theme .text-black { color: #f0f4f8 !important; }
html.dark-theme .text-white { color: #ffffff !important; }
html.dark-theme .text-gray-700 { color: #e2e8f0 !important; }
html.dark-theme .text-gray-600 { color: #cbd5e1 !important; }
html.dark-theme .text-gray-500 { color: #94a3b8 !important; }
html.dark-theme .text-gray-400 { color: #64748b !important; }
html.dark-theme .text-gray-300 { color: #475569 !important; }
html.dark-theme .border-black { border-color: #1e293b !important; }
html.dark-theme .border-gray-400 { border-color: #334155 !important; }
html.dark-theme .border-gray-300 { border-color: #1e293b !important; }
html.dark-theme .shadow-brutal { box-shadow: 0 0 20px rgba(139, 92, 246, 0.2), 4px 4px 0px 0px rgba(59, 130, 246, 0.15) !important; }
html.dark-theme .shadow-card { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 1px rgba(59, 130, 246, 0.3), inset 0 1px 0px rgba(255, 255, 255, 0.05) !important; }
html.dark-theme .hover\:bg-gray-50:hover { background: linear-gradient(135deg, #1a1f2e 0%, #252d3d 100%) !important; }
html.dark-theme .hover\:shadow-brutal:hover { box-shadow: 0 0 30px rgba(139, 92, 246, 0.3), 4px 4px 0px 0px rgba(59, 130, 246, 0.25) !important; }
html.dark-theme .bg-heirlock-yellow { background: linear-gradient(135deg, #65350f 0%, #92400e 100%) !important; }
html.dark-theme .bg-heirlock-green { background: linear-gradient(135deg, #064e3b 0%, #047857 100%) !important; }
html.dark-theme .bg-heirlock-pink { background: linear-gradient(135deg, #801336 0%, #be185d 100%) !important; }
html.dark-theme .bg-heirlock-blue { background: linear-gradient(135deg, #0c2d6b 0%, #1e40af 100%) !important; }
html.dark-theme .border-heirlock-yellow { border-color: #fcd34d !important; }
html.dark-theme .border-heirlock-green { border-color: #6ee7b7 !important; }
html.dark-theme .border-heirlock-pink { border-color: #f472b6 !important; }
html.dark-theme .border-heirlock-blue { border-color: #60a5fa !important; }
html.dark-theme h1, html.dark-theme h2, html.dark-theme h3 { color: #ffffff !important; text-shadow: 0 2px 8px rgba(139, 92, 246, 0.2) !important; }
html.dark-theme .font-black { color: #ffffff !important; }
html.dark-theme [class*="border-"] { border-color: inherit; }
html.dark-theme .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
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
