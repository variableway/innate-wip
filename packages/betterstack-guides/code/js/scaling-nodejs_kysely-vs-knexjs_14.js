# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 14

// See what SQL will be generated
const query = knex('users').where('active', true);
console.log(query.toString());
// "SELECT * FROM "users" WHERE "active" = true"