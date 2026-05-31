# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 13

// Define relationships in the schema
model User {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]  // One-to-many relationship
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}

// Query with related data
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true }
});
// Result already has user.posts as an array

// Filter by relationship
const usersWithPosts = await prisma.user.findMany({
  where: {
    posts: { some: { published: true } }
  },
  include: {
    posts: { where: { published: true } }
  }
});

// Create related records together
const newUser = await prisma.user.create({
  data: {
    name: 'Alice',
    posts: {
      create: [{ title: 'First Post' }]
    }
  },
  include: { posts: true }
});