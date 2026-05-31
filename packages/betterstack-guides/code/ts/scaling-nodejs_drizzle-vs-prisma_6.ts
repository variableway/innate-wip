# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 6

// Using Drizzle with the defined schema
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users, posts } from './schema';

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }));

async function main() {
  // Insert user and get ID
  const [user] = await db.insert(users)
    .values({ email: 'alice@example.com', name: 'Alice' })
    .returning();
  
  // Insert related post
  await db.insert(posts)
    .values({ title: 'Hello World', authorId: user.id });
  
  // Query with relations
  const userWithPosts = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
    with: { posts: true }
  });
}