/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0e1a',
          navy: '#0d1b2e',
          blue: '#1a3a6b',
          purple: '#6d28d9',
          violet: '#7c3aed',
          cyan: '#06b6d4',
          'cyan-light': '#22d3ee',
          green: '#10b981',
          'green-neon': '#00ff88',
          yellow: '#f59e0b',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'typing': 'typing 0.5s steps(1) infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #06b6d4, 0 0 10px #06b6d4' },
          '50%': { boxShadow: '0 0 20px #06b6d4, 0 0 40px #06b6d4, 0 0 60px #06b6d4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        typing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
