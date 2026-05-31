# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 26

[label src/index.ts]
app.delete('/users/:id', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;

   await prisma.user.delete({
     where: { id: Number(id) },
   });

   res.status(204).send();
 } catch (error) {
   console.error('Error deleting user:', error);
   res.status(500).json({ error: 'Failed to delete user' });
 }
});