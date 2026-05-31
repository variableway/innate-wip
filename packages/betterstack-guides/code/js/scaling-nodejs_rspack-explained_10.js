# Source: https://betterstack.com/community/guides/scaling-nodejs/rspack-explained/
# Original language: javascript
# Normalized: js
# Block index: 10

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
[highlight]
      {
        test: /\.scss$/,
        use: ['sass-loader'],
        type: 'css' // Use Rspack's built-in CSS processing
      },
[/highlight]
    ]
  }
};