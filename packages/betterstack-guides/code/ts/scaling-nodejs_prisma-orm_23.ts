# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 23

app.get('/users', async (req: Request, res: Response) => {
 try {
   const users = await prisma.user.findMany({
     select: {
       id: true,
       name: true,
       email: true,
       createdAt: true,
     },
   });

   res.json(users);
 } catch (error) {
   console.error('Error fetching users:', error);
   res.status(500).json({ error: 'Failed to fetch users' });
 }
});