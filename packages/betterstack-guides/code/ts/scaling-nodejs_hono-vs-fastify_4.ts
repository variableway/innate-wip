# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 4

import { FastifyInstance } from 'fastify';

interface UserBody {
  name: string;
  email: string;
}

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: UserBody }>('/users', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' }
        }
      }
    }
  }, async (request, reply) => {
    const { name, email } = request.body;
    const user = await createUser({ name, email });
    return reply.code(201).send(user);
  });
};