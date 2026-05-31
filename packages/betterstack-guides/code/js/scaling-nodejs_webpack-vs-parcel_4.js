# Source: https://betterstack.com/community/guides/scaling-nodejs/webpack-vs-parcel/
# Original language: javascript
# Normalized: js
# Block index: 4

[label webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        type: 'asset/resource'
      }
    ]
  }
};