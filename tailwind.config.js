/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E9F40B',
        secondary: '#403836',
        accent: '#C7BDBA',
        background: '#FFFFFF',
        text: '#000000',
      },
    },
  },
  plugins: [],
};