# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 27

[label src/index.ts]
app.post('/users/:id/posts', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;
   const { title, content, published } = req.body;

   const post = await prisma.post.create({
     data: {
       title,
       content,
       published: published ?? false,
       author: {
         connect: { id: Number(id) },
       },
     },
   });

   res.status(201).json(post);
 } catch (error) {
   console.error('Error creating post:', error);
   res.status(500).json({ error: 'Failed to create post' });
 }
});