# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 20

// Prisma custom type mappings
model Post {
  id       Int      @id @default(autoincrement())
  metadata Json     // Maps to a TypeScript object type
  tags     String[] // Maps to string array
}

// Drizzle custom type mappings
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  metadata: jsonb('metadata').$type<{ views: number, likes: number }>(),
  tags: array(text('tags'))
});