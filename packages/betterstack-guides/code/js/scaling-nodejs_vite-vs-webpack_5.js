# Source: https://betterstack.com/community/guides/scaling-nodejs/vite-vs-webpack/
# Original language: javascript
# Normalized: js
# Block index: 5

[label webpack.config.js]
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        ...
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    ...
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};