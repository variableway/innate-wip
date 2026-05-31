# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 11

// Table definitions
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull()
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authorId: integer('author_id').references(() => users.id)
});

// Relationship definitions
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}));