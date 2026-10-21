/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obs: {
          fg: '#1b1f23',
          muted: '#6e7681',
          border: '#d0d7de',
          bg: '#f6f8fa',
          blue: '#4c78a8',
          orange: '#f58518',
          red: '#e45756',
          teal: '#72b7b2',
          green: '#54a24b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
