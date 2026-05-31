# Source: https://betterstack.com/community/guides/scaling-nodejs/rspack-explained/
# Original language: javascript
# Normalized: js
# Block index: 13

[label rspack.config.js]
...
export default defineConfig({
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
[highlight]
      {
        // Add support for PNG, JPEG, GIF image formats
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource'
      },
[/highlight]
      {
        test: /\.scss$/,
        use: ['sass-loader'],
        type: 'css', // Use Rspack's built-in CSS processing
      },
     ....
    ],
  },
...
});