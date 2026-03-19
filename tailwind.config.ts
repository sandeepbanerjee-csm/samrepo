import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#bce2ff',
          300: '#8fd1ff',
          400: '#5bb6ff',
          500: '#3199ff',
          600: '#1d7ae9',
          700: '#185fc4',
          800: '#1a529f',
          900: '#1b477f'
        }
      }
    }
  },
  plugins: []
};

export default config;
