/** @type {import('tailwindcss').Config} */

const withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
};

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withOpacity('--color-primary'),
        },
        secondary: {
          DEFAULT: withOpacity('--color-secondary'),
        },
        background: {
          DEFAULT: withOpacity('--color-background'),
        },
        foreground: {
          DEFAULT: withOpacity('--color-foreground'),
        },
      },
      textColor: {
        primary: {
          DEFAULT: withOpacity('--color-primary'),
        },
        secondary: {
          DEFAULT: withOpacity('--color-secondary'),
        },
      },
      backgroundColor: {
        primary: {
          DEFAULT: withOpacity('--color-primary'),
        },
        secondary: {
          DEFAULT: withOpacity('--color-secondary'),
        },
        background: {
          DEFAULT: withOpacity('--color-background'),
        },
        foreground: {
          DEFAULT: withOpacity('--color-foreground'),
        },
      },
      ringColor: {
         primary: {
          DEFAULT: withOpacity('--color-primary'),
        },
      },
      borderColor: {
         primary: {
          DEFAULT: withOpacity('--color-primary'),
        },
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
