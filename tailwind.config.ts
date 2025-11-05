import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Snivel color codes (configurable request types)
        'snivel-yellow': '#FCD34D',      // Not After
        'snivel-navy': '#1E3A8A',        // Not Before
        'snivel-lightblue': '#7DD3FC',   // Available Window
        'snivel-green': '#22C55E',       // Available
        'snivel-red': '#EF4444',         // Not Available
        'snivel-orange': '#F97316',      // Vacation
        // Sleek black/gray accent
        'primary': '#111827',            // gray-900
        'primary-dark': '#000000',       // black
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideInRight: 'slideInRight 0.3s ease-out',
        slideInLeft: 'slideInLeft 0.3s ease-out',
        slideInTop: 'slideInTop 0.3s ease-out',
        slideInBottom: 'slideInBottom 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
      },
    },
  },
} satisfies Config;
