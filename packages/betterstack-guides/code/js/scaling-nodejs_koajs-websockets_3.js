# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-websockets/
# Original language: javascript
# Normalized: js
# Block index: 3

[label server.js]
import Koa from 'koa';
import serve from 'koa-static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = new Koa();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files
app.use(serve(join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});