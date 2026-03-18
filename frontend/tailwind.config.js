/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0865f0',
          dark: '#3730a3',
          light: '#e0e7ff',
        },
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        bg: '#f8fafc',
        surface: '#ffffff',
        surface2: '#f1f5f9',
      },
      spacing: {
        'sidebar': '260px',
        'sidebar-collapsed': '72px',
        'navbar': '64px',
      },
      borderRadius: {
        'default': '12px',
      },
      boxShadow: {
        'default': '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)',
        'lg': '0 8px 32px rgba(0,0,0,.12)',
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}