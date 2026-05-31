# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: typescript
# Normalized: ts
# Block index: 16

// Type-safe query inspection
const query = db.selectFrom('users').where('active', '=', true);
const { sql, parameters } = query.compile();
console.log(sql, parameters);
// "SELECT * FROM "users" WHERE "active" = $1" [true]