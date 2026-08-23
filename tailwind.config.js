/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom RaceService brand colors here later
        'race-primary': '#1a1a2e',
        'race-secondary': '#16213e',
        'race-accent': '#e94560',
      },
    },
  },
  plugins: [],
}
