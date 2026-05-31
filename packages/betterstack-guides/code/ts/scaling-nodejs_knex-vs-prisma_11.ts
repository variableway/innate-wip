# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 11

// Automatic transaction for related records
const result = await prisma.user.create({
  data: {
    name: 'Carol',
    email: 'carol@example.com',
    posts: {
      create: [
        { title: 'Carol\'s First Post' },
        { title: 'Carol\'s Second Post' }
      ]
    }
  },
  include: { posts: true }
});
// This happens in a transaction automatically

// Explicit transaction for custom flows
const [user, post] = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { name: 'Dave', email: 'dave@example.com' }
  });
  
  const post = await tx.post.create({
    data: { title: 'Dave\'s Post', authorId: user.id }
  });
  
  return [user, post];
});