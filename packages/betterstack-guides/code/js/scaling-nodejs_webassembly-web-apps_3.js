# Source: https://betterstack.com/community/guides/scaling-nodejs/webassembly-web-apps/
# Original language: javascript
# Normalized: js
# Block index: 3

[label webpack.config.js]
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, './'),
    },
    compress: true,
    port: 8080,
  },
};