# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 5

// A simple DIY model with Knex
class User {
  static async findById(id) {
    return knex('users').where({ id }).first();
  }
  
  static async create(data) {
    return knex('users').insert(data).returning('*');
  }
}