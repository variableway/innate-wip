# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 22

[label src/index.ts]
app.post('/users', async (req: Request, res: Response) => {
 try {
   const { name, email, password } = req.body;

   const user = await prisma.user.create({
     data: {
       name,
       email,
       password, // In production, hash this password!
     },
   });

   res.status(201).json(user);
 } catch (error) {
   console.error('Error creating user:', error);
   res.status(500).json({ error: 'Failed to create user' });
 }
});