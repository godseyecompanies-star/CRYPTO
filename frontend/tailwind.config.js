/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#10B981',
          'green-light': '#34D399',
          'green-dark': '#059669',
        },
        success: '#22C55E',
        profit: '#16A34A',
        'off-white': '#F9FAFB',
        'light-gray': '#F3F4F6',
        'border-gray': '#E5E7EB',
        'text-dark': '#111827',
        'text-gray': '#6B7280',
        'text-light': '#9CA3AF',
      },
    },
  },
  plugins: [],
}
