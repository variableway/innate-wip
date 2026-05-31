# Source: https://betterstack.com/community/guides/scaling-nodejs/vite-vs-webpack/
# Original language: javascript
# Normalized: js
# Block index: 2

// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: './dist',
    hot: true,
  },
};