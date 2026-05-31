# Source: https://betterstack.com/community/guides/scaling-nodejs/webpack-vs-parcel/
# Original language: javascript
# Normalized: js
# Block index: 6

[label webpack.config.js]
module.exports = {
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    static: './public'
  }
};