# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 24

[label src/index.ts]
app.get('/users/:id', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;

   const user = await prisma.user.findUnique({
     where: { id: Number(id) },
     include: {
       posts: true,
     },
   });

   if (!user) {
     return res.status(404).json({ error: 'User not found' });
   }

   res.json(user);
 } catch (error) {
   console.error('Error fetching user:', error);
   res.status(500).json({ error: 'Failed to fetch user' });
 }
});