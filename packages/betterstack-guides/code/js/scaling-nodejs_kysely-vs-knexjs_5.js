# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 5

function findUsers(filters) {
  let query = knex('users').select('*');
  
  if (filters.role) {
    query = query.where('role', filters.role);
  }
  
  if (filters.search) {
    query = query.where('username', 'like', `%${filters.search}%`);
  }
  
  return query;
}