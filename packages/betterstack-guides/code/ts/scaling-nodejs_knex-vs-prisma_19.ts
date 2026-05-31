# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 19

// Manual type definitions with Knex
interface User {
  id: number;
  name: string;
  email: string;
}

// Using your types with queries
const getUser = async (id: number): Promise<User | undefined> => {
  return knex<User>('users').where({ id }).first();
};

const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const [newUser] = await knex<User>('posts')
    .insert(user)
    .returning('*');
  return newUser;
};