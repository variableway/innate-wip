# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 11

const appRouter = t.router({
  createUser: t.procedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      // Input is validated and typed
      const user = await db.users.create({ data: input });
      return user;
    })
});