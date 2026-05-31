# Source: https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 55

[label src/routes/routes.js]
import urlSchema from '../schemas/url.schema.js';
import urlController from '../controllers/url.controller.js';
import rootController from '../controllers/root.controller.js';
import errorHandler from '../middleware/error.js';

export default async function fastifyRoutes(fastify) {
  fastify.get('/', rootController.render);

  fastify.post(
    '/shorten',
    {
      schema: {
        body: urlSchema,
      },
    },
    urlController.shorten
  );

[highlight]
  fastify.get('/health', (req, reply) => {
    reply.send({ status: 'ok' });
  });
[/highlight]

  fastify.get('/:shortID', urlController.redirect);

  fastify.setErrorHandler(errorHandler);
}