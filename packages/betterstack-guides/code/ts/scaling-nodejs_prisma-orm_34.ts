# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 34

const getPaginatedPosts = async (page = 1, pageSize = 10) => {
 const skip = (page - 1) * pageSize;

 const [posts, total] = await prisma.$transaction([
   prisma.post.findMany({
     skip,
     take: pageSize,
     orderBy: { createdAt: 'desc' },
     include: { author: true }
   }),
   prisma.post.count()
 ]);

 return {
   data: posts,
   meta: {
     total,
     page,
     pageSize,
     pageCount: Math.ceil(total / pageSize)
   }
 };
};