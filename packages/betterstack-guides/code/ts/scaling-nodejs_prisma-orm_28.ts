# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 28

[label src/index.ts]
app.get('/posts', async (req: Request, res: Response) => {
 try {
   const posts = await prisma.post.findMany({
     include: {
       author: {
         select: {
           id: true,
           name: true,
         },
       },
     },
   });

   res.json(posts);
 } catch (error) {
   console.error('Error fetching posts:', error);
   res.status(500).json({ error: 'Failed to fetch posts' });
 }
});