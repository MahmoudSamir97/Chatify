/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "scrollbar-track": "#6b7280",
      },
    },
  },

  plugins: [require("daisyui"), require("tailwind-scrollbar")],
};
