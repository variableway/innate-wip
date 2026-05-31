# Source: https://betterstack.com/community/guides/scaling-nodejs/rspack-explained/
# Original language: javascript
# Normalized: js
# Block index: 15

[label rspack.config.js]
...
export default defineConfig({
  entry: {
    main: './src/index.js',
  },
[highlight]
  // Add dev server settings
  devServer: {
    port: 3000,
    open: true,
    hot: true
  },
[/highlight]
  module: {
    // ... existing rules
  },
  plugins: [new rspack.HtmlRspackPlugin({ template: './index.html' })],
  experiments: {
    css: true,
  },
});