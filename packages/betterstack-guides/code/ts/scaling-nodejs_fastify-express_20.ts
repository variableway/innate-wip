# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: typescript
# Normalized: ts
# Block index: 20

const UserSchema = Type.Object({ name: Type.String() });
server.post<{ Body: Static<typeof UserSchema> }>(
  "/",
  { schema: { body: UserSchema } },
  (request) => {
    const { name } = request.body;
    // `name` is automatically inferred as a string
  }
);