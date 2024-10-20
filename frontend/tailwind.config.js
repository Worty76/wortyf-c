const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4caf50",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      fontWeight: {
        black: 900,
      },
    },
  },
  plugins: [],
});
