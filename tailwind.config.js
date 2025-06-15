module.exports = {
  content: [
    './owner.html',
    './consumer.html',
    './src/**/*.{html,js}', // If you plan to have JS/HTML in a src folder
    './*.js', // To include root JS files like owner.js, consumer.js
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
