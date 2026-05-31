# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-vs-bun/
# Original language: javascript
# Normalized: js
# Block index: 1

import { Database } from "bun:sqlite";

{
  using db = new Database("mydb.sqlite");
  using query = db.query("select 'Hello world' as message;");
  console.log(query.get()); // => { message: "Hello world" }
}