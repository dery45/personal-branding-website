/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        neon: {
          blue: 'var(--neon-blue)',
          green: 'var(--neon-green)',
          pink: 'var(--neon-pink)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
        },
      },
      fontFamily: {
        display: ['Tektur', 'system-ui', 'sans-serif'],
        body: ['Aldrich', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw + 1rem, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 5vw + 1rem, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 3vw + 1rem, 2.5rem)', { lineHeight: '1.1' }],
        body: ['1rem', { lineHeight: '1.65' }],
        caption: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.04em' }],
      },
    },
  },
  plugins: [],
};
