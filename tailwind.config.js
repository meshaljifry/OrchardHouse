// tailwind.config.js
const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      dashboardBackground: '#f2f3ae',
      dashboardText: '#3c1518',
    }},
  },
  darkMode: "class",
  plugins: [nextui()],
};