/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'saree-maroon': '#4A0404',
        'saree-gold': '#D4AF37',
        'saree-cream': '#F5F5DC',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}