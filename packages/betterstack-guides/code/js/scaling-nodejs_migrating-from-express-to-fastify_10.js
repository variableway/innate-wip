# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 10

// Custom error classes
class BusinessLogicError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'BusinessLogicError';
    this.statusCode = statusCode;
  }
}

// Usage in route handlers
fastify.get('/users/:id', async (request, reply) => {
  const user = await findUser(request.params.id);
  if (!user) {
    throw new BusinessLogicError('User not found', 404);
  }
  return user;
});