# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-vs-bun/
# Original language: javascript
# Normalized: js
# Block index: 0

import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(":memory:");
const query = db.prepare("SELECT 'Hello world' AS message");
const result = query.get();
console.log(result); // => { message: 'Hello world' }