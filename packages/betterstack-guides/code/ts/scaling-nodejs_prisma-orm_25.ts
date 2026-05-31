# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 25

app.put('/users/:id', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;
   const { name, email } = req.body;

   const user = await prisma.user.update({
     where: { id: Number(id) },
     data: {
       name,
       email,
     },
   });

   res.json(user);
 } catch (error) {
   console.error('Error updating user:', error);
   res.status(500).json({ error: 'Failed to update user' });
 }
});